import requests, csv, os, smtplib, ssl, time
import pandas as pd


def add_email(course_code, email_to_add):
    """
    Given a course code and email, write a new row to the emails CSV file.
    """

    #Read emails.csv into a table and add the new email address & course code
    df = pd.read_csv('emails.csv')
    row = [course_code, 0, 0, email_to_add]
    df.loc[len(df)] = row
    df.to_csv('emails.csv', index=False)

    #Update the availability and capacity for that course from the nodes.csv file
    update_availability()


def remove_email_from_csv(email, coursecode):
    """
    Given a course code and email, find and delete that row from the CSV file.
    """
    df = pd.read_csv('emails.csv')
    filtered_df = df[(df['email'] != email) | (df['coursecode'] != coursecode)]
    filtered_df.to_csv('emails.csv', index=False)


def send_emails_gmail():
    """
    Opens the emails csv file, and for any course that has availability greater than 0,
    sends an email to that person and then removes the row from the CSV.
    Assumes that the Gmail username and password are already set up as environment variables
    on the server.
    """
    port = 587
    server = smtplib.SMTP('smtp.gmail.com',587)
    server.ehlo()
    server.starttls()
    sender_email = os.environ.get('COURSEEXPLOREREMAIL')
    password = os.environ.get('COURSEEXPLORERPASSWORD')

    server.login(sender_email, password)

    with open('emails.csv') as f:
        r = csv.reader(f)
        next(r)

        for email, coursecode, availability, capacity in r:

            if int(availability) > 0:
                message = "From: " + sender_email + "\nTo: " + email + "\nSubject: Course Availability\n" + "Good news, a spot has opened up! Here's the current availability for " + coursecode + "\n" + availability + "/" + capacity
                receiver_email = email
                server.sendmail(sender_email, receiver_email, message)
                time.sleep(0.5)

                remove_email_from_csv(email, coursecode)

    server.quit()

def update_availability():
    """
    Reads the nodes.csv file that is saved daily by the web scraper to
    update the course availability in the emails.csv file.
    Assumes the web scraping schedule has been set up on the server (as a cron job)
    """
    emails = pd.read_csv('emails.csv')
    nodes = pd.read_csv('nodes.csv')

    #For each row in the emails csv
    for row in emails.itertuples():

        #Find the row for the matching course in the nodes csv
        nodes_row = nodes.loc[nodes['course'] == row.coursecode]

        #Update the availability and capacity in the emails csv
        emails.at[row.Index, 'availability'] = nodes_row.availability
        emails.at[row.Index, 'capacity'] = nodes_row.capacity

    #Write the updated emails table to disk
    emails.columns = emails.columns.str.replace('Unnamed.*', '')
    emails.to_csv('emails.csv', index=False)


#### Code for using Mailgun instead of Gmail. This could be used for a production environment to send many
#### emails each day. But Mailgun requires access to the DNS settings for the website
#### that this project is hosted on.

#
#def send_emails_mailgun():
#    with open('emails.csv') as f:
#        r = csv.reader(f)
#        next(r)

        # For each row in the csv
#        for email, coursecode, availability, capacity in r:

#            if int(availability) > 0:

#                data={"from": "mailgunsandboxemailgoeshere",
#                    "to": email,
#                    "subject": coursecode + " Availability",
#                    "text": "A spot has opened up! Here's the current availability for " + coursecode + "\n" + availability + "/" + capacity
#                }
#                send_message(data)

#            remove_email_from_csv(email, coursecode)

#def send_message(data):
#	return requests.post(
#		"mailgunapiurlgoeshere",
#		auth=("api", "authgoeshere"),
#		data=data)

update_availability()
send_emails_gmail()
