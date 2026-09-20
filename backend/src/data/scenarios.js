// Einheitlicher Empfänger für alle Trainingsnachrichten.
// Dadurch erlebt der Benutzer das gesamte Training
// aus der Perspektive derselben fiktiven Person.
const TRAINING_RECIPIENT =
    "Max Mustermann <max.mustermann@example.de>";


const scenarios = [

  // =======================================================
  // 1. MICROSOFT – GEFÄLSCHTE SICHERHEITSWARNUNG
  // =======================================================

  {
    senderName: "Microsoft-Kontosicherheit",

    // Fiktive Trainingsdomain.
    senderEmail:
        "security@microsoft-kontoschutz.test",

    recipient: TRAINING_RECIPIENT,

    subject:
        "Ungewöhnliche Anmeldung bei Ihrem Microsoft-Konto",

    date:
        "15.01.2027, 08:42",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Wir haben eine ungewöhnliche Anmeldung bei Ihrem Microsoft-Konto von einem neuen Gerät festgestellt.",
      "Bestätigen Sie die Aktivität innerhalb der nächsten 30 Minuten, um eine vorübergehende Sperrung Ihres Kontos zu verhindern."
    ],

    actionText:
        "Anmeldung überprüfen",

    displayedUrl:
        "https://account.microsoft.com",

    actualUrl:
        "https://microsoft-kontoschutz.test/login",

    signature:
        "Microsoft Account Security",

    correctAnswer:
        "phishing",

    explanation:
        "Die Nachricht imitiert eine Microsoft-Sicherheitswarnung. Die Absenderdomain gehört jedoch nicht zu Microsoft. Zusätzlich erzeugt die kurze Frist unnötigen Zeitdruck und der sichtbare Link stimmt nicht mit dem tatsächlichen Linkziel überein.",

    clues: [
      {
        id: "sender",
        title:
            "Verdächtige Absenderadresse",
        description:
            "Die Nachricht verwendet microsoft-kontoschutz.test statt einer offiziellen Microsoft-Domain."
      },
      {
        id: "paragraph-1",
        title:
            "Künstlicher Zeitdruck",
        description:
            "Die angebliche Sperrung innerhalb von 30 Minuten soll zu einer schnellen Reaktion führen."
      },
      {
        id: "link",
        title:
            "Abweichendes Linkziel",
        description:
            "Der Button wirkt wie ein Microsoft-Link, führt tatsächlich aber auf microsoft-kontoschutz.test."
      }
    ]
  },


  // =======================================================
  // 2. VODAFONE – LEGITIME RECHNUNGSINFO
  // =======================================================

  {
    senderName:
        "Vodafone Kundenservice",

    // Plausible Trainingsadresse auf der offiziellen Domain.
    // Sie bedeutet nicht, dass Vodafone exakt dieses Postfach nutzt.
    senderEmail:
        "kundenservice@vodafone.de",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihre Vodafone-Rechnung ist verfügbar",

    date:
        "15.01.2027, 09:08",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Ihre aktuelle Vodafone-Rechnung steht ab sofort in Ihrem Kundenkonto zur Verfügung.",
      "Öffnen Sie bei Bedarf die MeinVodafone-App oder rufen Sie vodafone.de direkt über Ihren Browser auf."
    ],

    actionText:
        null,

    displayedUrl:
        null,

    actualUrl:
        null,

    signature:
        "Ihr Vodafone-Team",

    correctAnswer:
        "legitim",

    explanation:
        "Die Nachricht verlangt keine Zugangsdaten und enthält keinen direkten Login-Link. Stattdessen wird empfohlen, die bekannte Vodafone-App oder die Website selbstständig zu öffnen.",

    clues: [
      {
        id: "official-domain",
        title:
            "Plausible Domain",
        description:
            "Die Absenderadresse verwendet die offizielle Domain vodafone.de."
      },
      {
        id: "safe-navigation",
        title:
            "Sicherer Handlungsvorschlag",
        description:
            "Die Nachricht empfiehlt, die bekannte App oder Website selbst zu öffnen."
      }
    ]
  },


  // =======================================================
  // 3. DHL – PAKETZUSTELLUNG
  // =======================================================

  {
    senderName:
        "DHL Paket",

    senderEmail:
        "zustellung@dhl-paketstatus.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihre Sendung konnte nicht zugestellt werden",

    date:
        "15.01.2027, 09:37",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "Ihre DHL-Sendung konnte heute aufgrund einer unvollständigen Lieferadresse nicht zugestellt werden.",
      "Bestätigen Sie Ihre Anschrift und begleichen Sie eine erneute Zustellgebühr von 1,49 EUR, damit wir morgen einen weiteren Zustellversuch durchführen können."
    ],

    actionText:
        "Lieferadresse bestätigen",

    displayedUrl:
        "https://www.dhl.de/sendungsverfolgung",

    actualUrl:
        "https://dhl-paketstatus.test/zahlung",

    signature:
        "DHL Kundenservice",

    correctAnswer:
        "phishing",

    explanation:
        "Die Nachricht nutzt eine typische Paketbenachrichtigung als Köder. Sie enthält keine konkrete Sendungsnummer, fordert eine kleine Zahlung und führt auf eine fremde Domain.",

    clues: [
      {
        id: "sender",
        title:
            "Falsche DHL-Domain",
        description:
            "Die Absenderadresse verwendet dhl-paketstatus.test und nicht die offizielle DHL-Domain."
      },
      {
        id: "paragraph-1",
        title:
            "Kleine Nachzahlung",
        description:
            "Sehr geringe Gebühren werden häufig verwendet, um Zahlungs- oder Kreditkartendaten abzugreifen."
      },
      {
        id: "link",
        title:
            "Gefälschtes Linkziel",
        description:
            "Der sichtbare Link verweist auf dhl.de, tatsächlich führt der Button aber auf eine andere Domain."
      }
    ]
  },


  // =======================================================
  // 4. NORTON – GEFÄLSCHTE ABO-VERLÄNGERUNG
  // =======================================================

  {
    senderName:
        "Norton Abonnementservice",

    senderEmail:
        "rechnung@norton-aboservice.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihre Norton-Lizenz wurde automatisch verlängert",

    date:
        "15.01.2027, 10:03",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Ihr Norton-Sicherheitsabonnement wurde automatisch um ein weiteres Jahr verlängert.",
      "Der Betrag von 349,99 EUR wird heute von Ihrem hinterlegten Zahlungsmittel eingezogen. Falls Sie die Verlängerung nicht autorisiert haben, können Sie diese innerhalb von zwei Stunden stornieren."
    ],

    actionText:
        "Verlängerung stornieren",

    displayedUrl:
        "https://my.norton.com",

    actualUrl:
        "https://norton-aboservice.test/refund",

    signature:
        "Norton Billing Service",

    correctAnswer:
        "phishing",

    explanation:
        "Die Nachricht erzeugt durch einen hohen Rechnungsbetrag und eine sehr kurze Stornierungsfrist starken Handlungsdruck. Absender und Zieladresse gehören nicht zur offiziellen Norton-Domain.",

    clues: [
      {
        id: "sender",
        title:
            "Verdächtige Absenderdomain",
        description:
            "norton-aboservice.test ist keine offizielle Norton-Domain."
      },
      {
        id: "subject",
        title:
            "Überraschende Abbuchung",
        description:
            "Unerwartete Rechnungen und Verlängerungen werden häufig als Köder eingesetzt."
      },
      {
        id: "paragraph-1",
        title:
            "Zeitdruck",
        description:
            "Die angebliche Zwei-Stunden-Frist soll verhindern, dass die Nachricht in Ruhe überprüft wird."
      },
      {
        id: "link",
        title:
            "Abweichendes Linkziel",
        description:
            "Der sichtbare Link wirkt legitim, das tatsächliche Ziel gehört jedoch zu einer fremden Domain."
      }
    ]
  },


  // =======================================================
  // 5. ADAC – LEGITIME INFORMATION
  // =======================================================

  {
    senderName:
        "ADAC",

    senderEmail:
        "mitgliederservice@adac.de",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Neue digitale Mitgliedskarte verfügbar",

    date:
        "15.01.2027, 10:31",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "Ihre digitale ADAC-Mitgliedskarte steht in der ADAC-App zur Verfügung.",
      "Sie müssen auf diese Nachricht nicht antworten. Öffnen Sie bei Bedarf die bereits installierte ADAC-App."
    ],

    actionText:
        null,

    displayedUrl:
        null,

    actualUrl:
        null,

    signature:
        "Ihr ADAC Mitgliederservice",

    correctAnswer:
        "legitim",

    explanation:
        "Die Nachricht fordert keine Zahlung oder Anmeldung über einen eingebetteten Link. Die Information kann über die bekannte ADAC-App überprüft werden.",

    clues: [
      {
        id: "official-domain",
        title:
            "Plausible Absenderdomain",
        description:
            "Die Nachricht verwendet die offizielle Domain adac.de."
      },
      {
        id: "independent-check",
        title:
            "Unabhängig überprüfbar",
        description:
            "Die Information kann direkt über die bekannte ADAC-App kontrolliert werden."
      }
    ]
  },


  // =======================================================
  // 6. TECHNIKER KRANKENKASSE – GEFÄLSCHTE ERSTATTUNG
  // =======================================================

  {
    senderName:
        "Techniker Krankenkasse",

    senderEmail:
        "erstattung@tk-versichertenservice.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Erstattung von 286,40 EUR für Sie verfügbar",

    date:
        "15.01.2027, 11:02",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "Für Ihr Versichertenkonto wurde eine Rückerstattung in Höhe von 286,40 EUR freigegeben.",
      "Zur Auszahlung müssen Sie Ihre Bankverbindung innerhalb von 48 Stunden über unser Onlineformular bestätigen."
    ],

    actionText:
        "Erstattung anfordern",

    displayedUrl:
        "https://www.tk.de/versicherte",

    actualUrl:
        "https://tk-versichertenservice.test/erstattung",

    signature:
        "Techniker Krankenkasse",

    correctAnswer:
        "phishing",

    explanation:
        "Die Aussicht auf eine unerwartete Erstattung soll zum Klick verleiten. Die Absenderdomain ist nicht die offizielle TK-Domain und die Bankdaten sollen über eine fremde Website eingegeben werden.",

    clues: [
      {
        id: "sender",
        title:
            "Fremde Domain",
        description:
            "Die Absenderadresse gehört nicht zu tk.de."
      },
      {
        id: "paragraph-0",
        title:
            "Unerwartete Erstattung",
        description:
            "Ein unerwarteter Geldbetrag erzeugt Neugier und erhöht die Wahrscheinlichkeit eines Klicks."
      },
      {
        id: "paragraph-1",
        title:
            "Bankdaten und Frist",
        description:
            "Die Kombination aus Bankdatenabfrage und kurzer Frist ist besonders kritisch."
      },
      {
        id: "link",
        title:
            "Gefälschte Zielseite",
        description:
            "Der sichtbare TK-Link stimmt nicht mit der tatsächlichen Zieladresse überein."
      }
    ]
  },


  // =======================================================
  // 7. PAYPAL – VERDÄCHTIGE ZAHLUNG
  // =======================================================

  {
    senderName:
        "PayPal",

    senderEmail:
        "transaktion@paypal-kontoschutz.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Zahlung über 729,00 EUR wurde autorisiert",

    date:
        "15.01.2027, 11:36",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Sie haben eine Zahlung über 729,00 EUR an Digital Electronics GmbH autorisiert.",
      "Falls Sie diese Transaktion nicht kennen, melden Sie den Vorgang sofort über unser Sicherheitscenter."
    ],

    actionText:
        "Zahlung melden",

    displayedUrl:
        "https://www.paypal.com/de/security",

    actualUrl:
        "https://paypal-kontoschutz.test/security",

    signature:
        "PayPal Sicherheitsteam",

    correctAnswer:
        "phishing",

    explanation:
        "Eine vermeintlich hohe Zahlung erzeugt Angst und Handlungsdruck. Die E-Mail stammt nicht von paypal.com und der Sicherheitslink führt auf eine fremde Domain.",

    clues: [
      {
        id: "sender",
        title:
            "Nicht offizielle PayPal-Domain",
        description:
            "Die Absenderadresse gehört nicht zu paypal.com."
      },
      {
        id: "subject",
        title:
            "Hoher Geldbetrag",
        description:
            "Der auffällig hohe Betrag soll eine emotionale Reaktion auslösen."
      },
      {
        id: "link",
        title:
            "Gefälschtes Sicherheitscenter",
        description:
            "Der sichtbare PayPal-Link stimmt nicht mit dem tatsächlichen Ziel überein."
      }
    ]
  },


  // =======================================================
  // 8. DEUTSCHE BAHN – LEGITIME VERSPÄTUNGSINFO
  // =======================================================

  {
    senderName:
        "Deutsche Bahn",

    senderEmail:
        "reiseinformation@bahn.de",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Information zu Ihrer Reise nach Hamburg",

    date:
        "15.01.2027, 12:04",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "für Ihre gespeicherte Verbindung nach Hamburg liegt eine Fahrplanänderung vor.",
      "Die aktuellen Reiseinformationen können Sie direkt in der DB Navigator App oder über bahn.de abrufen."
    ],

    actionText:
        null,

    displayedUrl:
        null,

    actualUrl:
        null,

    signature:
        "Ihr Team der Deutschen Bahn",

    correctAnswer:
        "legitim",

    explanation:
        "Die Nachricht fordert weder Zugangsdaten noch eine Zahlung und verweist auf bekannte offizielle Kanäle.",

    clues: [
      {
        id: "official-domain",
        title:
            "Plausible Domain",
        description:
            "Die Nachricht verwendet die offizielle Domain bahn.de."
      },
      {
        id: "safe-channel",
        title:
            "Bekannter Kommunikationsweg",
        description:
            "Die Information kann unabhängig über die DB Navigator App überprüft werden."
      }
    ]
  },


  // =======================================================
  // 9. VODAFONE – GEFÄLSCHTE VERTRAGSSPERRUNG
  // =======================================================

  {
    senderName:
        "Vodafone Sicherheit",

    senderEmail:
        "konto@vodafone-vertragsservice.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihr Vodafone-Konto wird heute eingeschränkt",

    date:
        "15.01.2027, 12:39",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Bei der letzten Abbuchung Ihrer Mobilfunkrechnung ist ein Fehler aufgetreten.",
      "Aktualisieren Sie Ihre Zahlungsdaten noch heute, damit Ihr Anschluss nicht vorübergehend gesperrt wird."
    ],

    actionText:
        "Zahlungsdaten aktualisieren",

    displayedUrl:
        "https://www.vodafone.de/meinvodafone",

    actualUrl:
        "https://vodafone-vertragsservice.test/payment",

    signature:
        "Vodafone Kundenservice",

    correctAnswer:
        "phishing",

    explanation:
        "Die Nachricht imitiert Vodafone, verwendet aber eine fremde Domain. Zusätzlich wird mit einer kurzfristigen Anschlusssperre gedroht und zur Eingabe von Zahlungsdaten aufgefordert.",

    clues: [
      {
        id: "sender",
        title:
            "Gefälschte Vodafone-Adresse",
        description:
            "Die Domain gehört nicht zu vodafone.de."
      },
      {
        id: "paragraph-1",
        title:
            "Drohende Sperrung",
        description:
            "Die mögliche Sperrung soll Max zu einer schnellen Eingabe seiner Zahlungsdaten bewegen."
      },
      {
        id: "link",
        title:
            "Abweichendes Zahlungsportal",
        description:
            "Der Button führt nicht zu MeinVodafone."
      }
    ]
  },


  // =======================================================
  // 10. MICROSOFT – ASCII SMUGGLING / UNICODE
  // =======================================================

  {
    senderName:
        "Microsoft 365",

    senderEmail:
        "office@microsoft365-dokumente.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Neues vertrauliches Dokument für Sie",

    date:
        "15.01.2027, 13:12",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Ihnen wurde ein vertrauliches Finanzierungsdokument über Microsoft 365 freigegeben.",
      "Öffnen Sie das Dokument und melden Sie sich mit Ihrem Microsoft-Konto an, um den Inhalt anzuzeigen."
    ],

    actionText:
        "Dokument öffnen",

    displayedUrl:
        "https://office.com",

    actualUrl:
        "https://microsoft365-dokumente.test/login",

    signature:
        "Microsoft 365",

    correctAnswer:
        "phishing",

    explanation:
        "Die Nachricht enthält mehrere Warnzeichen. Zusätzlich können moderne Phishing-Kampagnen unsichtbare Unicode-Tag-Zeichen innerhalb bestimmter Wörter einsetzen. Für Menschen sieht das Wort unverändert aus, während Filter oder Tokenizer einen anderen Inhalt verarbeiten.",

    clues: [
      {
        id: "sender",
        title:
            "Fremde Microsoft-Domain",
        description:
            "Die Absenderadresse gehört nicht zu einer offiziellen Microsoft-Domain."
      },
      {
        id: "paragraph-0",
        title:
            "Mögliche unsichtbare Unicode-Zeichen",
        description:
            "Bei sogenannten ASCII-Smuggling-Techniken können unsichtbare Unicode-Zeichen mitten in Wörtern versteckt werden. Sichtbar könnte beispielsweise „Finanzierung“ stehen, obwohl intern zusätzliche Zeichen enthalten sind."
      },
      {
        id: "link",
        title:
            "Gefälschte Microsoft-Anmeldung",
        description:
            "Der sichtbare Office-Link führt tatsächlich auf eine fremde Loginseite."
      }
    ]
  },


  // =======================================================
  // 11. ADAC – VERDÄCHTIGE BEITRAGSERHÖHUNG
  // =======================================================

  {
    senderName:
        "ADAC Mitgliederservice",

    senderEmail:
        "beitrag@adac-mitgliedschaft.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Änderung Ihres Mitgliedsbeitrags",

    date:
        "15.01.2027, 13:44",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "für Ihre ADAC-Mitgliedschaft wurde eine neue Beitragsstufe hinterlegt.",
      "Bitte prüfen Sie die Änderung und bestätigen Sie Ihre derzeitige Zahlungsart."
    ],

    actionText:
        "Beitragsänderung prüfen",

    displayedUrl:
        "https://www.adac.de/mein-adac",

    actualUrl:
        "https://adac-mitgliedschaft.test/konto",

    signature:
        "ADAC Mitgliederservice",

    correctAnswer:
        "phishing,

    explanation:
        "Eine Änderung des Mitgliedsbeitrags könnte grundsätzlich plausibel sein. Die fremde Domain und die Aufforderung zur Bestätigung der Zahlungsart sind jedoch Warnzeichen. Die Information sollte direkt über die ADAC-App oder die offizielle Website geprüft werden.",

    clues: [
      {
        id: "sender",
        title:
            "Unbekannte Domain",
        description:
            "Die Absenderdomain ist nicht adac.de."
      },
      {
        id: "paragraph-1",
        title:
            "Zahlungsdaten überprüfen",
        description:
            "Die Nachricht fordert eine Bestätigung der Zahlungsart."
      },
      {
        id: "link",
        title:
            "Abweichendes Linkziel",
        description:
            "Der angezeigte ADAC-Link stimmt nicht mit dem tatsächlichen Ziel überein."
      }
    ]
  },


  // =======================================================
  // 12. TK – LEGITIME DOKUMENTENINFO
  // =======================================================

  {
    senderName:
        "Techniker Krankenkasse",

    senderEmail:
        "service@tk.de",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Neues Dokument in Ihrem persönlichen Bereich",

    date:
        "15.01.2027, 14:18",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "In Ihrem persönlichen Bereich steht ein neues Dokument für Sie bereit.",
      "Öffnen Sie zur Einsicht die TK-App oder rufen Sie tk.de selbstständig im Browser auf."
    ],

    actionText:
        null,

    displayedUrl:
        null,

    actualUrl:
        null,

    signature:
        "Ihre Techniker Krankenkasse",

    correctAnswer:
        "legitim",

    explanation:
        "Die Nachricht enthält keine direkte Login-Aufforderung und verweist auf bekannte offizielle Kanäle.",

    clues: [
      {
        id: "official-domain",
        title:
            "Offizielle Domain",
        description:
            "Die Nachricht verwendet tk.de."
      },
      {
        id: "known-channel",
        title:
            "Sicherer Zugang",
        description:
            "Das Dokument soll über die bekannte App oder durch manuelles Öffnen der Website geprüft werden."
      }
    ]
  },


  // =======================================================
  // 13. AMAZON – GEFÄLSCHTE BESTELLUNG
  // =======================================================

  {
    senderName:
        "Amazon.de",

    senderEmail:
        "bestellung@amazon-kundenkonto.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihre Bestellung über 1.249,00 EUR wurde bestätigt",

    date:
        "15.01.2027, 14:51",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "vielen Dank für Ihre Bestellung eines Apple MacBook Pro im Wert von 1.249,00 EUR.",
      "Falls Sie diese Bestellung nicht aufgegeben haben, können Sie den Auftrag über den folgenden Button sofort stornieren."
    ],

    actionText:
        "Bestellung stornieren",

    displayedUrl:
        "https://www.amazon.de/meine-bestellungen",

    actualUrl:
        "https://amazon-kundenkonto.test/orders",

    signature:
        "Amazon Kundenservice",

    correctAnswer:
        "phishing",

    explanation:
        "Der hohe Kaufbetrag erzeugt Angst und soll zum schnellen Klick führen. Die Absenderadresse und das tatsächliche Linkziel gehören nicht zu Amazon.",

    clues: [
      {
        id: "sender",
        title:
            "Falsche Amazon-Domain",
        description:
            "Die Nachricht stammt nicht von amazon.de."
      },
      {
        id: "subject",
        title:
            "Auffällig hoher Kaufbetrag",
        description:
            "Der hohe Betrag soll eine starke emotionale Reaktion auslösen."
      },
      {
        id: "link",
        title:
            "Gefälschte Bestellübersicht",
        description:
            "Der sichtbare Amazon-Link führt tatsächlich auf eine fremde Domain."
      }
    ]
  },


  // =======================================================
  // 14. DHL – LEGITIME SENDUNGSANKÜNDIGUNG
  // =======================================================

  {
    senderName:
        "DHL Paket",

    senderEmail:
        "paketinfo@dhl.de",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "Ihre Sendung wird morgen zugestellt",

    date:
        "15.01.2027, 15:24",

    greeting:
        "Guten Tag Herr Mustermann,",

    paragraphs: [
      "Ihre Sendung wird voraussichtlich morgen zugestellt.",
      "Die Sendungsinformationen können Sie über die DHL-App oder durch manuelle Eingabe der Sendungsnummer auf dhl.de prüfen."
    ],

    actionText:
        null,

    displayedUrl:
        null,

    actualUrl:
        null,

    signature:
        "Ihr DHL Paket-Team",

    correctAnswer:
        "legitim",

    explanation:
        "Die Nachricht verlangt keine Zahlung und fordert nicht zur Anmeldung über einen eingebetteten Link auf. Die Sendung kann unabhängig über bekannte DHL-Kanäle geprüft werden.",

    clues: [
      {
        id: "official-domain",
        title:
            "Plausible DHL-Domain",
        description:
            "Die Nachricht verwendet dhl.de."
      },
      {
        id: "independent-check",
        title:
            "Unabhängige Prüfung möglich",
        description:
            "Die Sendungsinformationen können über die bekannte DHL-App überprüft werden."
      }
    ]
  },


  // =======================================================
  // 15. NORTON – VERDÄCHTIGE SICHERHEITSWARNUNG
  // =======================================================

  {
    senderName:
        "Norton Security",

    senderEmail:
        "warning@norton-securitycheck.test",

    recipient:
    TRAINING_RECIPIENT,

    subject:
        "5 Viren auf Ihrem Gerät gefunden",

    date:
        "15.01.2027, 16:03",

    greeting:
        "Hallo Max Mustermann,",

    paragraphs: [
      "Bei einer automatischen Sicherheitsprüfung wurden fünf kritische Bedrohungen auf Ihrem Gerät festgestellt.",
      "Starten Sie sofort die Bereinigung, bevor persönliche Daten und gespeicherte Passwörter gefährdet werden."
    ],

    actionText:
        "Bedrohungen entfernen",

    displayedUrl:
        "https://my.norton.com/security",

    actualUrl:
        "https://norton-securitycheck.test/scan",

    signature:
        "Norton Security Team",

    correctAnswer:
        "phishing",

    explanation:
        "Eine E-Mail kann ohne entsprechende Softwareprüfung nicht einfach feststellen, dass auf einem bestimmten Gerät fünf Viren vorhanden sind. Die Nachricht nutzt Angst und führt auf eine fremde Domain.",

    clues: [
      {
        id: "sender",
        title:
            "Unbekannte Norton-Domain",
        description:
            "Die Absenderadresse gehört nicht zur offiziellen Norton-Domain."
      },
      {
        id: "subject",
        title:
            "Alarmierende Aussage",
        description:
            "Die konkrete Behauptung, fünf Viren seien gefunden worden, soll Angst auslösen."
      },
      {
        id: "paragraph-1",
        title:
            "Starker Handlungsdruck",
        description:
            "Persönliche Daten und Passwörter werden als unmittelbar gefährdet dargestellt."
      },
      {
        id: "link",
        title:
            "Fremde Zielseite",
        description:
            "Der Button führt nicht zum offiziellen Norton-Dienst."
      }
    ]
  }

];


export default scenarios;