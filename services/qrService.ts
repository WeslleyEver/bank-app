export function processQRCode(data: string) {
  if (data.includes("BR.GOV.BCB.PIX")) {
    return {
      type: "PIX",
      payload: data,
    };
  }

  return {
    type: "UNKNOWN",
    payload: data,
  };
}
