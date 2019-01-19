# frozen_string_literal: true

require 'sinatra'
require 'twilio-ruby'

ACCOUNT_SID = ENV['ACCOUNT_SID']
ACCOUNT_TOKEN = ENV['ACCOUNT_TOKEN']
CALLER_ID = ENV['CALLER_ID']
API_VERSION = '2008-08-01'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

post '/sax/twiml' do
  content_type :xml

  Twilio::TwiML::VoiceResponse.new do |r|
    r.play url: url('/sax.mp3'), loop: 0
  end.to_s
end

post '/sax/call' do
  client = Twilio::REST::Client.new ACCOUNT_SID, ACCOUNT_TOKEN
  client.calls.create(
    from: CALLER_ID,
    to: params[:victim],
    url: url('/sax/twiml')
  ).sid
end
