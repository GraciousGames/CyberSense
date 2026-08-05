const scenarios = [
  {
    id: 1,
    senderName: "PayPal Sicherheit",
    senderEmail: "support@paypaI-security.example",
    recipient: "grace@example.com",
    subject: "Ihr Konto wird innerhalb von 24 Stunden gesperrt",
    date: "Heute, 14:32",
    greeting: "Guten Tag,",
    paragraphs: [
      "Wir haben ungewöhnliche Aktivitäten in Ihrem Konto festgestellt.",
      "Bestätigen Sie innerhalb von 24 Stunden Ihre Identität. Andernfalls wird Ihr Konto dauerhaft gesperrt."
    ],
    actionText: "Konto bestätigen",
    displayedUrl: "https://www.paypal.de",
    actualUrl: "https://paypal-security.example",
    signature: "Ihr PayPal-Sicherheitsteam",
    correctAnswer: "phishing",
    explanation:
      "Die Absenderadresse ist manipuliert und die Nachricht erzeugt künstlichen Zeitdruck.",
    clues: [
      {
        id: "sender",
        title: "Manipulierte Absenderadresse",
        description:
          "In paypaI wurde das kleine l durch ein großes I ersetzt."
      },
      {
        id: "urgency",
        title: "Künstlicher Zeitdruck",
        description:
          "Die angebliche Sperrung innerhalb von 24 Stunden soll zu einer schnellen und unüberlegten Handlung führen."
      },
      {
        id: "link",
        title: "Abweichende Zieladresse",
        description:
          "Der angezeigte Link und die tatsächliche Zieladresse stimmen nicht überein."
      }
    ]
  },
  {
    id: 2,
    senderName: "HAW Hamburg Bibliothek",
    senderEmail: "bibliothek@haw-hamburg.de",
    recipient: "grace@example.com",
    subject: "Erinnerung an die Rückgabe",
    date: "Gestern, 09:15",
    greeting: "Guten Tag,",
    paragraphs: [
      "die Leihfrist eines ausgeliehenen Mediums endet in drei Tagen.",
      "Bitte prüfen Sie den aktuellen Status direkt über die offizielle Webseite der Bibliothek."
    ],
    actionText: null,
    displayedUrl: null,
    actualUrl: null,
    signature: "Ihre HAW-Bibliothek",
    correctAnswer: "legitim",
    explanation:
      "Die Nachricht verwendet eine plausible Absenderadresse und fordert weder Passwörter noch eine sofortige Zahlung.",
    clues: [
      {
        id: "sender",
        title: "Plausible Absenderadresse",
        description:
          "Die Adresse verwendet die offizielle Domain haw-hamburg.de."
      },
      {
        id: "content",
        title: "Keine sensible Aufforderung",
        description:
          "Es werden weder Passwörter noch Zahlungsinformationen verlangt."
      }
    ]
  },
  {
    id: 3,
    senderName: "DHL Paketservice",
    senderEmail: "zustellung@dhl-paketgebuehr.example",
    recipient: "grace@example.com",
    subject: "Ihre Sendung konnte nicht zugestellt werden",
    date: "Heute, 08:47",
    greeting: "Hallo,",
    paragraphs: [
      "Ihre Sendung konnte aufgrund einer offenen Zustellgebühr nicht ausgeliefert werden.",
      "Zahlen Sie jetzt 1,99 Euro, um eine erneute Zustellung zu veranlassen."
    ],
    actionText: "Zustellung bezahlen",
    displayedUrl: "https://www.dhl.de",
    actualUrl: "https://dhl-paketgebuehr.example",
    signature: "DHL Kundenservice",
    correctAnswer: "phishing",
    explanation:
      "Die unerwartete Kleinzahlung und die fremde Domain sind typische Phishing-Merkmale.",
    clues: [
      {
        id: "sender",
        title: "Keine offizielle Domain",
        description:
          "Die Adresse endet nicht auf dhl.de."
      },
      {
        id: "payment",
        title: "Unerwartete Kleinzahlung",
        description:
          "Geringe Beträge wirken glaubwürdig und sollen die Hemmschwelle senken."
      },
      {
        id: "link",
        title: "Gefälschte Zieladresse",
        description:
          "Der sichtbare Text täuscht eine offizielle DHL-Adresse vor."
      }
    ]
  }
];

export default scenarios;