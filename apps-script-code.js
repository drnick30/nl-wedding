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
        time: "2:00 PM",
        venue: "The Stable, 41/43 Bode Thomas Street, Surulere, Lagos",
        dressCode: "Burgundy, Gold & Olive Green",
        color: "#6b0e1e",
        accent: "#c9a84c",
        img: "https://drnick30.github.io/nl-wedding/photos/invite-trad-template.png",
        code: "NL-TRAD-" + new Date().getTime().toString(36).toUpperCase()
      });
    }
    if (data.event === "white" || data.event === "both") {
      events.push({
        name: "White Wedding",
        date: "Saturday, 22 August 2026",
        time: "10:00 AM",
        venue: "Our Lady of Perpetual Help, 14B Musa YarAdua Street, Victoria Island, Lagos",
        reception: "Reception to follow at Hall of Odin, Elegushi Beach, Lekki",
        dressCode: "Rose Gold, Dusty Pink, Navy Blue & Chocolate Brown",
        color: "#1b2a4a",
        accent: "#c4917b",
        img: "https://drnick30.github.io/nl-wedding/photos/invite-template.png",
        code: "NL-WHITE-" + new Date().getTime().toString(36).toUpperCase()
      });
    }

    var cardHtml = "";
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(data.firstName + " " + data.lastName + " - " + ev.name + " - " + ev.code + " - Guests: " + data.guests);

      cardHtml += "<div style='max-width:420px;margin:0 auto 32px;font-family:Georgia,serif;border:1px solid #d4c4a8;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)'>";

      cardHtml += "<img src='" + ev.img + "' width='420' style='width:100%;display:block;border-radius:12px 12px 0 0' alt='" + ev.name + " Invitation'>";

      cardHtml += "<div style='background:" + ev.color + ";padding:14px 24px;text-align:center'>";
      cardHtml += "<div style='font-size:20px;color:#d4b060;font-style:italic;letter-spacing:2px'>N &nbsp;|&nbsp; L</div>";
      cardHtml += "<div style='font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:3px;text-transform:uppercase;margin-top:2px'>Nilo26</div>";
      cardHtml += "</div>";

      cardHtml += "<div style='padding:32px 28px;background:#f9f5ef;text-align:center'>";

      cardHtml += "<div style='font-size:11px;color:#b89640;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px'>The Demesi Family &amp; The Okonkwo Family</div>";

      cardHtml += "<div style='font-size:14px;color:#7a6a58;font-style:italic;line-height:1.6;margin-bottom:16px'>Cordially invite you to the<br>wedding ceremony of their children</div>";

      cardHtml += "<div style='font-size:26px;color:#1a1410;margin-bottom:6px;font-weight:normal;letter-spacing:1px'>Nicholas &amp; Loveth</div>";

      cardHtml += "<div style='width:60px;height:1px;background:#d4b060;margin:12px auto'></div>";

      cardHtml += "<div style='font-size:10px;color:#b89640;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px'>You Are Invited</div>";

      cardHtml += "<div style='font-size:32px;color:" + ev.color + ";font-style:italic;margin-bottom:6px'>" + data.firstName + " " + data.lastName + "</div>";

      cardHtml += "<div style='font-size:11px;color:" + ev.accent + ";letter-spacing:3px;text-transform:uppercase;margin-bottom:20px'>" + ev.name + "</div>";

      cardHtml += "<div style='width:80px;height:1px;background:#d4c4a8;margin:0 auto 20px'></div>";

      cardHtml += "<table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom:16px'><tr>";
      cardHtml += "<td style='text-align:center;padding:8px;border-right:1px solid #d4c4a8;width:33%'>";
      cardHtml += "<div style='font-size:9px;color:#b89640;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px'>Date</div>";
      cardHtml += "<div style='font-size:13px;color:#1a1410'>" + ev.date + "</div>";
      cardHtml += "</td>";
      cardHtml += "<td style='text-align:center;padding:8px;border-right:1px solid #d4c4a8;width:33%'>";
      cardHtml += "<div style='font-size:9px;color:#b89640;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px'>Time</div>";
      cardHtml += "<div style='font-size:13px;color:#1a1410'>" + ev.time + "</div>";
      cardHtml += "</td>";
      cardHtml += "<td style='text-align:center;padding:8px;width:33%'>";
      cardHtml += "<div style='font-size:9px;color:#b89640;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px'>Guests</div>";
      cardHtml += "<div style='font-size:13px;color:#1a1410'>" + data.guests + "</div>";
      cardHtml += "</td>";
      cardHtml += "</tr></table>";

      cardHtml += "<div style='font-size:12px;color:#7a6a58;margin-bottom:6px'>" + ev.venue + "</div>";

      if (ev.reception) {
        cardHtml += "<div style='font-size:12px;color:" + ev.accent + ";font-style:italic;margin-bottom:12px'>" + ev.reception + "</div>";
      }

      cardHtml += "<div style='font-size:9px;color:#b89640;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px'>Dress Code</div>";
      cardHtml += "<div style='font-size:12px;color:#7a6a58;margin-bottom:20px'>" + ev.dressCode + "</div>";

      cardHtml += "<div style='width:80px;height:1px;background:#d4c4a8;margin:0 auto 16px'></div>";

      cardHtml += "<div style='margin:0 auto;width:150px'><img src='" + qrUrl + "' width='150' height='150' alt='QR Code' style='border:2px solid #d4b060;border-radius:8px;display:block'></div>";

      cardHtml += "<div style='font-family:monospace;font-size:10px;letter-spacing:2px;color:#7a6a58;margin-top:8px'>" + ev.code + "</div>";

      cardHtml += "<div style='width:60px;height:1px;background:#d4b060;margin:16px auto'></div>";

      cardHtml += "<div style='font-size:16px;color:#b89640;font-style:italic'>#nilo2026</div>";

      cardHtml += "</div>";
      cardHtml += "</div>";
    }

    var emailBody = "<div style='max-width:480px;margin:0 auto;padding:40px 16px;font-family:Georgia,serif;background:#f5f0e8'>";

    emailBody += "<div style='text-align:center;margin-bottom:32px'>";
    emailBody += "<div style='font-size:32px;color:#1a1410;font-style:italic;margin-bottom:4px'>Thank You, " + data.firstName + "!</div>";
    emailBody += "<div style='font-size:14px;color:#7a6a58;font-style:italic'>Your RSVP has been confirmed</div>";
    emailBody += "<div style='width:60px;height:1px;background:#d4b060;margin:16px auto'></div>";
    emailBody += "<div style='font-size:12px;color:#7a6a58;line-height:1.7'>Present this invitation at the venue entrance.<br>You can screenshot the card below or show this email.</div>";
    emailBody += "</div>";

    emailBody += cardHtml;

    emailBody += "<div style='text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #d4c4a8'>";
    emailBody += "<div style='font-size:10px;color:#b89640;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px'>Need Help?</div>";
    emailBody += "<div style='font-size:12px;color:#7a6a58;line-height:1.8'>";
    emailBody += "Vwede: +234 903 761 9097<br>";
    emailBody += "Maureen: +234 816 267 7441<br>";
    emailBody += "Email: nicholasandloveth@gmail.com</div>";
    emailBody += "</div>";

    emailBody += "<div style='text-align:center;margin-top:32px'>";
    emailBody += "<div style='font-size:14px;color:#7a6a58;font-style:italic'>We cannot wait to celebrate with you!</div>";
    emailBody += "<div style='font-size:24px;color:#b89640;font-style:italic;margin-top:8px'>Nicholas &amp; Loveth</div>";
    emailBody += "<div style='font-size:12px;margin-top:4px'>&#128155;</div>";
    emailBody += "</div>";

    emailBody += "</div>";

    MailApp.sendEmail({
      to: data.email,
      subject: "Your Wedding Invitation - Nicholas & Loveth | #nilo2026",
      htmlBody: emailBody
    });
  }

  return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
}
