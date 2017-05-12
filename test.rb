# frozen_string_literal: true

ENV['RACK_ENV'] = 'test'

require_relative 'app'
require 'test/unit'
require 'rack/test'
require 'webmock/test_unit'
require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'vcr_cassettes'
  config.hook_into :webmock

  # Mask Twilio credentials
  ac_regexp = %r{AC[a-z0-9]{32}}
  ac_mask = '{MaskedAccountID}'
  config.before_playback do |i|
    i.request.uri.sub! ac_mask, "#{ACCOUNT_SID}"
  end
  config.before_record do |i|
    i.request.uri.sub! ac_regexp, ac_mask
    i.request.headers['Authorization'] = ''
    i.response.body.gsub! ac_regexp, ac_mask
  end
end

class AppTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def test_index_has_dear_tw
    get '/'
    assert last_response.ok?
    assert_match %r{^text/html}, last_response.content_type
    assert_match 'Dear ThoughtWorks', last_response.body
  end

  def test_sax_call_twiml
    post '/sax/twiml'
    assert last_response.ok?
    assert_match %r{^application/xml}, last_response.content_type
    assert_match 'sax.mp3', last_response.body
  end

  def test_sax_call_error_invalid
    VCR.use_cassette('error_invalid') do
      assert_raise Twilio::REST::RequestError do
        post '/sax/call', victim: '+15005550001'
      end
    end
  end

  def test_sax_call_error_countrycode
    VCR.use_cassette('error_countrycode') do
      assert_raise Twilio::REST::RequestError do
        post '/sax/call', victim: '+15005550003'
      end
    end
  end

  def test_sax_call_ok
    VCR.use_cassette('ok') do
      post '/sax/call', victim: '+15005550005'
    end
    assert last_response.ok?
    assert_match %r{^text/html}, last_response.content_type
  end

  def test_mp3
    get '/sax.mp3'
    assert last_response.ok?
    assert_equal 'audio/mpeg', last_response.content_type
  end
end
