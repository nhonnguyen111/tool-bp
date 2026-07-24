export function numberToVietnameseWords(number) {
  const ones = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  number = Number(number);

  if (isNaN(number)) return "";

  if (number === 0) return "Không";

  const integerPart = Math.floor(number);
  const decimalPart = number.toString().split(".")[1];

  function readThreeDigits(num, full = false) {
    let result = "";

    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;

    // Hàng trăm
    if (hundred > 0) {
      result += ones[hundred] + " trăm";
    } else if (full && (ten > 0 || unit > 0)) {
      result += "không trăm";
    }

    // Hàng chục
    if (ten > 1) {
      result += " " + ones[ten] + " mươi";

      switch (unit) {
        case 1:
          result += " mốt";
          break;
        case 4:
          result += " tư";
          break;
        case 5:
          result += " lăm";
          break;
        default:
          if (unit > 0) result += " " + ones[unit];
      }
    } else if (ten === 1) {
      result += " mười";

      if (unit === 5) result += " lăm";
      else if (unit > 0) result += " " + ones[unit];
    } else {
      if ((hundred > 0 || full) && unit > 0) {
        result += " lẻ";
      }

      if (unit > 0) {
        result += " " + ones[unit];
      }
    }

    return result.trim();
  }

  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];

  let groups = [];
  let temp = integerPart;

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let result = "";

  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] !== 0) {
      result +=
        readThreeDigits(groups[i], i < groups.length - 1) +
        (units[i] ? " " + units[i] : "") +
        " ";
    } else if (i > 0 && groups.slice(0, i).some((x) => x > 0)) {
      result += readThreeDigits(0, true) + " ";
    }
  }

  result = result.trim().replace(/\s+/g, " ");

  // Đọc phần thập phân
  if (decimalPart) {
    result += " phẩy";

    for (const digit of decimalPart) {
      result += " " + ones[Number(digit)];
    }
  }

  // Viết hoa chữ cái đầu
  return result
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
