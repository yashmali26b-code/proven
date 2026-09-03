export async function generateSampleDocument(docType, scenario = "genuine") {
  if (typeof document === "undefined") return null;

  if (docType === "PAN") {
    return await generatePanImage(scenario);
  }

  if (docType === "Aadhaar") {
    return await generateAadhaarImage(scenario);
  }

  if (docType === "Passport") {
    return await generatePassportImage(scenario);
  }

  return null;
}

export async function generateDemoCombo(comboId) {
  if (comboId === "pan_aadhaar_genuine") {
    const pan = await generatePanImage("genuine");
    const aadhaar = await generateAadhaarImage("genuine");
    return [pan, aadhaar];
  }

  if (comboId === "specimen_fake") {
    const fakePan = await generatePanImage("specimen");
    return [fakePan];
  }

  if (comboId === "dob_mismatch") {
    const pan = await generatePanImage("genuine");
    const badAadhaar = await generateAadhaarImage("mismatched_dob");
    return [pan, badAadhaar];
  }

  if (comboId === "pan_passport") {
    const pan = await generatePanImage("genuine");
    const passport = await generatePassportImage("genuine");
    return [pan, passport];
  }

  const defaultPan = await generatePanImage("genuine");
  const defaultAadhaar = await generateAadhaarImage("genuine");
  return [defaultPan, defaultAadhaar];
}

function generatePanImage(scenario = "genuine") {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 1000, 630);
    grad.addColorStop(0, "#f0fdf4");
    grad.addColorStop(1, "#dcfce7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 630);

    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 980, 610);

    ctx.fillStyle = "#14532d";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("आयकर विभाग  INCOME TAX DEPARTMENT", 40, 55);
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("भारत सरकार  GOVT. OF INDIA", 40, 90);

    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(880, 75, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("INDIA", 860, 80);

    ctx.fillStyle = "#bbf7d0";
    ctx.fillRect(750, 160, 190, 240);
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 3;
    ctx.strokeRect(750, 160, 190, 240);
    ctx.fillStyle = "#166534";
    ctx.font = "18px sans-serif";
    ctx.fillText("CITIZEN PHOTO", 775, 290);

    let name = "Kumar Gaurav Rathod";
    let fatherName = "Suresh Rathod";
    let dob = "14/05/1992";
    let panNumber = "ABCDE1234A";
    let fileName = "pan_card_genuine.png";

    if (scenario === "specimen") {
      name = "SAMPLE NAME";
      fatherName = "SAMPLE FATHER";
      dob = "01/01/1990";
      panNumber = "ABCDE1234F";
      fileName = "pan_card_specimen_dummy.png";
    }

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("नाम / Name", 50, 170);
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(name, 50, 215);

    ctx.font = "bold 18px sans-serif";
    ctx.fillText("पिता का नाम / Father's Name", 50, 275);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(fatherName, 50, 315);

    ctx.font = "bold 18px sans-serif";
    ctx.fillText("जन्म की तारीख / Date of Birth", 50, 375);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(dob, 50, 415);

    ctx.font = "bold 18px sans-serif";
    ctx.fillText("स्थायी खाता संख्या / Permanent Account Number", 50, 480);
    ctx.font = "bold 36px monospace";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(panNumber, 50, 530);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 24px cursive";
    ctx.fillText(name.split(" ")[0] + " Signature", 750, 520);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(740, 535);
    ctx.lineTo(940, 535);
    ctx.stroke();

    canvas.toBlob((blob) => {
      resolve(new File([blob], fileName, { type: "image/png" }));
    }, "image/png");
  });
}

function generateAadhaarImage(scenario = "genuine") {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 630);

    ctx.fillStyle = "#ea580c";
    ctx.fillRect(0, 0, 1000, 18);

    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, 612, 1000, 18);

    ctx.fillStyle = "#c2410c";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("भारतीय विशिष्ट पहचान प्राधिकरण", 50, 60);
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Unique Identification Authority of India", 50, 95);

    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(60, 150, 190, 240);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 150, 190, 240);
    ctx.fillStyle = "#64748b";
    ctx.font = "18px sans-serif";
    ctx.fillText("PHOTO", 120, 280);

    let name = "Kumar Gaurav Rathod";
    let dob = "14/05/1992";
    let uid = "3849 2018 4920";
    let fileName = "aadhaar_card_genuine.png";

    if (scenario === "mismatched_dob") {
      dob = "20/11/1999";
      fileName = "aadhaar_card_mismatched_dob.png";
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(name, 290, 190);

    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText(`जन्म तारीख / DOB: ${dob}`, 290, 245);
    ctx.fillText("लिंग / Gender: MALE / पुरुष", 290, 295);

    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#c2410c";
    ctx.fillText(uid, 290, 420);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(750, 150, 180, 180);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.strokeRect(750, 150, 180, 180);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("SECURE QR CODE", 770, 245);
    ctx.font = "11px sans-serif";
    ctx.fillText("2048-bit RSA Signed", 775, 270);

    ctx.fillStyle = "#c2410c";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("मेरा आधार, मेरी पहचान", 500, 560);
    ctx.textAlign = "left";

    canvas.toBlob((blob) => {
      resolve(new File([blob], fileName, { type: "image/png" }));
    }, "image/png");
  });
}

function generatePassportImage(scenario = "genuine") {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 1000, 630);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("REPUBLIC OF INDIA / भारत गणराज्य", 50, 60);
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("PASSPORT / पासपोर्ट", 50, 95);

    ctx.fillStyle = "#334155";
    ctx.fillRect(60, 140, 200, 260);
    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 140, 200, 260);

    let surname = "RATHOD";
    let givenName = "KUMAR GAURAV";
    let dob = "14/05/1992";
    let passportNo = "Z2849102";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Surname / उपनाम:", 300, 160);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(surname, 300, 195);

    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Given Name(s) / दिया गया नाम:", 300, 240);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(givenName, 300, 275);

    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Date of Birth / जन्म तिथि:", 300, 320);
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(dob, 300, 350);

    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Passport No / पासपोर्ट संख्या:", 700, 160);
    ctx.font = "bold 26px monospace";
    ctx.fillStyle = "#fef08a";
    ctx.fillText(passportNo, 700, 200);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(40, 480, 920, 120);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.fillText("P<IND" + surname + "<<" + givenName.replace(" ", "<") + "<<<<<<<<<<<<<<<<<<<<", 60, 525);
    ctx.fillText(passportNo + "4IND9205148M3012246<<<<<<<<<<<<<<04", 60, 565);

    canvas.toBlob((blob) => {
      resolve(new File([blob], "passport_sample.png", { type: "image/png" }));
    }, "image/png");
  });
}
