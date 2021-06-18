import sys, os
from commands import Commands
from datetime import date
from textparser import parse
from emailsender import get_availability, send_emails_gmail

filename = 'data.txt'
print(f"Parsing {filename}...\n")

try:
    os.remove(os.path.join((os.path.dirname(os.path.realpath(__file__))), 'data.bin'))
except:
    pass

data = parse(os.path.join((os.path.dirname(os.path.realpath(__file__))), filename))

Commands().scrape(data)
Commands().export_data(data)

update_availability()
send_emails_gmail()

date = date.today()
print("Daily scrape and export complete at: ", date)