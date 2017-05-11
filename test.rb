ENV['RACK_ENV'] = 'test'

require_relative 'app'
require 'test/unit'
require 'rack/test'
require 'webmock/test_unit'
require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = "vcr_cassettes"
  config.hook_into :webmock
end

class AppTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def test_index_has_dear_tw
    get '/'
    assert last_response.ok?
    assert_match 'Dear ThoughtWorks', last_response.body
  end

  def test_sax_call_twiml
    post '/sax/twiml'
    assert last_response.ok?
    assert_match /^application\/xml/, last_response.content_type
    assert_match 'sax.mp3', last_response.body
  end

  def test_sax_call_error_countrycode
    cc_bahrain = '+973'
    VCR.use_cassette('error') do
      post '/sax/call', victim: cc_bahrain + '123456789'
    end
    assert last_response.client_error?
    assert_match /^application\/xml/, last_response.content_type
  end

  def test_sax_call_ok
    cc_bahrain = '+1'
    VCR.use_cassette('ok') do
      post '/sax/call', victim: cc_bahrain + '2062299142'
    end
    assert last_response.ok?
    assert_match /^application\/xml/, last_response.content_type
  end

  def test_mp3
    get '/sax.mp3'
    assert last_response.ok?
    assert_equal 'audio/mpeg', last_response.content_type
  end
end
