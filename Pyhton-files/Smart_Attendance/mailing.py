import smtplib

# creates SMTP session
s = smtplib.SMTP('smtp.gmail.com', 587)
# start TLS for security
s.starttls()

# Authentication

s.login("ankit6202273766@gmail.com","kpdtkxyzupafsyac")

# message to be sent
message = "Hello!! this is a test email"

# sending the mail
s.sendmail("ankit6202273766+sender@gmail.com", "mailamritsingh1901@gmail.com", message)

# terminating the session
s.quit()