# RSVP Backend Setup — Google Sheets + Email Boarding Pass

Follow these steps to connect RSVPs to a Google Sheet AND send boarding pass emails to guests.

## 1. Create a Google Sheet
- Go to sheets.google.com and create a new spreadsheet
- Name it **"NL Wedding RSVPs"**
- Add these headers in Row 1:
  `Timestamp | First Name | Last Name | Email | Phone | Guests | Event | Message | Confirmation Code`

## 2. Add the Apps Script
- In the spreadsheet, go to **Extensions > Apps Script**
- Delete the default code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Save to spreadsheet
  sheet.appendRow([
    data.timestamp,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.guests,
    data.event,
    data.message,
    data.confirmationCode || ''
  ]);
  
  // Send notification to you
  MailApp.sendEmail({
    to: 'deminero30.od@gmail.com',
    subject: '🎉 New RSVP: ' + data.firstName + ' ' + data.lastName,
    htmlBody: '<h2>New Wedding RSVP</h2>' +
      '<p><b>Name:</b> ' + data.firstName + ' ' + data.lastName + '</p>' +
      '<p><b>Event:</b> ' + data.event + '</p>' +
      '<p><b>Guests:</b> ' + data.guests + '</p>' +
      '<p><b>Email:</b> ' + data.email + '</p>' +
      '<p><b>Phone:</b> ' + data.phone + '</p>' +
      '<p><b>Message:</b> ' + data.message + '</p>' +
      '<p><b>Confirmation:</b> ' + (data.confirmationCode || 'N/A') + '</p>'
  });
  
  // Send boarding pass email to guest
  if (data.email) {
    var events = [];
    if (data.event === 'trad' || data.event === 'both') {
      events.push({
        name: 'Traditional Wedding',
        date: 'Thursday, 20 August 2026',
        time: '14:00',
        venue: 'The Stable, 41/43 Bode Thomas Street, Surulere, Lagos',
        color: '#6b0e1e',
        code: 'NL-TRAD-' + new Date().getTime().toString(36).toUpperCase()
      });
    }
    if (data.event === 'white' || data.event === 'both') {
      events.push({
        name: 'White Wedding',
        date: 'Saturday, 22 August 2026',
        time: '10:00',
        venue: 'Our Lady of Perpetual Help, 14B Musa Yar\'Adua Street, Victoria Island, Lagos',
        color: '#1b2a4a',
        code: 'NL-WHITE-' + new Date().getTime().toString(36).toUpperCase()
      });
    }
    
    var boardingPassHtml = events.map(function(ev) {
      return '<div style="max-width:420px;margin:0 auto 24px;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.15);font-family:Georgia,serif">' +
        '<div style="background:' + ev.color + ';padding:16px 24px;display:flex;justify-content:space-between;align-items:center">' +
          '<span style="font-family:cursive;font-size:20px;color:white">N & L Airlines</span>' +
          '<span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d4b060;border:1px solid #d4b060;padding:3px 8px;border-radius:3px">VIP Guest</span>' +
        '</div>' +
        '<div style="padding:20px 24px;background:white">' +
          '<div style="margin-bottom:12px"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Passenger</span><span style="font-size:18px">' + data.firstName + ' ' + data.lastName + '</span></div>' +
          '<div style="margin-bottom:12px"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Event</span><span style="font-size:16px">' + ev.name + '</span></div>' +
          '<div style="display:inline-block;width:48%;margin-bottom:12px"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Date</span><span>' + ev.date + '</span></div>' +
          '<div style="display:inline-block;width:48%;margin-bottom:12px"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Boarding</span><span>' + ev.time + '</span></div>' +
          '<div style="margin-bottom:12px"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Venue</span><span>' + ev.venue + '</span></div>' +
          '<div style="display:inline-block;width:48%"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Guests</span><span>' + data.guests + '</span></div>' +
          '<div style="display:inline-block;width:48%"><span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block">Confirmation</span><span style="font-weight:bold">' + ev.code + '</span></div>' +
        '</div>' +
        '<div style="border-top:2px dashed #ddd;padding:12px 24px;background:white;text-align:center">' +
          '<span style="font-family:monospace;font-size:10px;letter-spacing:3px;color:#999">||| ' + ev.code + ' |||</span>' +
        '</div>' +
      '</div>';
    }).join('');
    
    MailApp.sendEmail({
      to: data.email,
      subject: '🎉 Your Boarding Pass — Nicholas & Loveth Wedding',
      htmlBody: '<div style="max-width:480px;margin:0 auto;padding:32px 16px;font-family:Georgia,serif;background:#f5f0e8">' +
        '<h1 style="text-align:center;font-family:cursive;color:#1a1410;font-weight:normal;font-size:28px">Thank You, ' + data.firstName + '!</h1>' +
        '<p style="text-align:center;color:#7a6a58;font-style:italic;margin-bottom:24px">Your RSVP has been confirmed. Here\'s your boarding pass — screenshot it or present this email at the venue entrance.</p>' +
        boardingPassHtml +
        '<p style="text-align:center;color:#7a6a58;font-style:italic;margin-top:24px">We can\'t wait to celebrate with you!<br>With love, Nicholas & Loveth 💛</p>' +
      '</div>'
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy
- Click **Deploy > New deployment**
- Select type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**
- Click **Deploy** and copy the URL
- When prompted, authorize the app to send emails on your behalf

## 4. Update the website
- Open `index.html`
- Find `REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL`
- Replace it with your deployment URL

## What happens when a guest RSVPs:

1. ✅ Their RSVP is saved to your Google Sheet (your guest list!)
2. ✅ You get an email notification with their details
3. ✅ The guest sees a boarding pass on-screen with a QR code
4. ✅ The guest receives an email with their boarding pass(es)
5. ✅ Each boarding pass has a unique confirmation code
6. ✅ If they chose "Both", they get TWO boarding passes (one per event)

## Guest List
Your Google Sheet IS your guest list. You can:
- Sort by event (Traditional / White / Both)
- Filter by number of guests to get total headcount
- Export to CSV/Excel for your planner
