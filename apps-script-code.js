function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.guests,
    data.event,
    data.message,
    data.confirmationCode || ""
  ]);

  MailApp.sendEmail({
    to: "deminero30.od@gmail.com",
    subject: "New RSVP: " + data.firstName + " " + data.lastName,
    htmlBody: "<h2>New Wedding RSVP</h2>" +
      "<p><b>Name:</b> " + data.firstName + " " + data.lastName + "</p>" +
      "<p><b>Event:</b> " + data.event + "</p>" +
      "<p><b>Guests:</b> " + data.guests + "</p>" +
      "<p><b>Email:</b> " + data.email + "</p>" +
      "<p><b>Phone:</b> " + data.phone + "</p>" +
      "<p><b>Message:</b> " + data.message + "</p>" +
      "<p><b>Confirmation:</b> " + (data.confirmationCode || "N/A") + "</p>"
  });

  if (data.email) {
    var events = [];
    if (data.event === "trad" || data.event === "both") {
      events.push({
        name: "Traditional Wedding",
        date: "Thursday, 20 August 2026",
        time: "14:00",
        venue: "The Stable, 41/43 Bode Thomas Street, Surulere, Lagos",
        color: "#6b0e1e",
        code: "NL-TRAD-" + new Date().getTime().toString(36).toUpperCase()
      });
    }
    if (data.event === "white" || data.event === "both") {
      events.push({
        name: "White Wedding",
        date: "Saturday, 22 August 2026",
        time: "10:00",
        venue: "Our Lady of Perpetual Help, 14B Musa YarAdua Street, Victoria Island, Lagos",
        color: "#1b2a4a",
        code: "NL-WHITE-" + new Date().getTime().toString(36).toUpperCase()
      });
    }

    var passHtml = "";
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" + encodeURIComponent(ev.code + "|" + data.firstName + "|" + ev.name);
      passHtml += "<div style='max-width:420px;margin:0 auto 24px;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.15);font-family:Georgia,serif'>";
      passHtml += "<div style='background:" + ev.color + ";padding:16px 24px'>";
      passHtml += "<table width='100%' cellpadding='0' cellspacing='0'><tr>";
      passHtml += "<td style='font-size:22px;color:white;font-style:italic'>Nilo26</td>";
      passHtml += "<td align='right'><span style='font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#d4b060;border:1px solid #d4b060;padding:4px 10px;border-radius:3px'>VIP Guest</span></td>";
      passHtml += "</tr></table></div>";
      passHtml += "<div style='padding:24px;background:white'>";
      passHtml += "<div style='margin-bottom:14px'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>PASSENGER</span><span style='font-size:20px;color:#1a1410'>" + data.firstName + " " + data.lastName + "</span></div>";
      passHtml += "<div style='margin-bottom:14px'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>EVENT</span><span style='font-size:17px;color:#1a1410'>" + ev.name + "</span></div>";
      passHtml += "<table width='100%' cellpadding='0' cellspacing='0'><tr>";
      passHtml += "<td style='padding-bottom:14px;width:50%'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>DATE</span><span style='font-size:15px'>" + ev.date + "</span></td>";
      passHtml += "<td style='padding-bottom:14px;width:50%'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>BOARDING</span><span style='font-size:15px'>" + ev.time + "</span></td>";
      passHtml += "</tr></table>";
      passHtml += "<div style='margin-bottom:14px'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>VENUE</span><span style='font-size:14px'>" + ev.venue + "</span></div>";
      passHtml += "<table width='100%' cellpadding='0' cellspacing='0'><tr>";
      passHtml += "<td style='width:50%'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>GUESTS</span><span style='font-size:15px'>" + data.guests + "</span></td>";
      passHtml += "<td style='width:50%'><span style='font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;display:block;margin-bottom:2px'>CONFIRMATION</span><span style='font-size:13px;font-weight:bold;font-family:monospace'>" + ev.code + "</span></td>";
      passHtml += "</tr></table></div>";
      passHtml += "<div style='border-top:2px dashed #ddd;padding:16px 24px;background:white'>";
      passHtml += "<table width='100%' cellpadding='0' cellspacing='0'><tr>";
      passHtml += "<td style='font-family:monospace;font-size:10px;letter-spacing:3px;color:#999;vertical-align:middle'>||| " + ev.code + " |||</td>";
      passHtml += "<td align='right'><img src='" + qrUrl + "' width='80' height='80' alt='QR Code' style='border:1px solid #eee;border-radius:4px'></td>";
      passHtml += "</tr></table></div></div>";
    }

    var emailBody = "<div style='max-width:480px;margin:0 auto;padding:32px 16px;font-family:Georgia,serif;background:#f5f0e8'>";
    emailBody += "<h1 style='text-align:center;font-style:italic;color:#1a1410;font-weight:normal;font-size:28px;margin-bottom:8px'>Thank You, " + data.firstName + "!</h1>";
    emailBody += "<p style='text-align:center;color:#7a6a58;font-style:italic;margin-bottom:32px;font-size:15px'>Your RSVP has been confirmed. Present this email at the venue entrance.</p>";
    emailBody += passHtml;
    emailBody += "<p style='text-align:center;color:#7a6a58;font-style:italic;margin-top:32px;font-size:15px'>We cannot wait to celebrate with you!<br><br>With love,<br><span style='font-size:22px;color:#b89640;font-style:italic'>Nicholas &amp; Loveth</span></p>";
    emailBody += "</div>";

    MailApp.sendEmail({
      to: data.email,
      subject: "Your Boarding Pass - Nicholas & Loveth Wedding",
      htmlBody: emailBody
    });
  }

  return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
}
