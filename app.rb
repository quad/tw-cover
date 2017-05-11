require 'sinatra'
require 'twiliolib'

ACCOUNT_SID = ENV['ACCOUNT_SID']
ACCOUNT_TOKEN = ENV['ACCOUNT_TOKEN']
CALLER_ID = ENV['CALLER_ID']
API_VERSION = '2008-08-01'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

post '/sax/twiml' do
  content_type :xml
  erb :twiml
end

post '/sax/call' do
  content_type :xml

  account = Twilio::RestAccount.new(ACCOUNT_SID, ACCOUNT_TOKEN)

  resp = account.request(
    "/#{API_VERSION}/Accounts/#{ACCOUNT_SID}/Calls",
    'POST',
    {
      'Caller' => CALLER_ID,
      'Called' => params[:victim],
      'Url' => url('/sax/twiml'),
    })
  return halt 400, resp.body unless resp.kind_of? Net::HTTPSuccess

  resp.body
end
