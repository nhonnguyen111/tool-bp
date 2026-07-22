export function numberToVietnameseWords(number) {
    const ones = [
        "không", "một", "hai", "ba", "bốn",
        "năm", "sáu", "bảy", "tám", "chín"
    ];

    if (number === 0) return "không";

    function readThreeDigits(num, full = false) {
        let result = "";

        let hundreds = Math.floor(num / 100);
        let rest = num % 100;
        let tens = Math.floor(rest / 10);
        let unit = rest % 10;

        // Hàng trăm
        if (hundreds > 0) {
            result += ones[hundreds] + " trăm";
        } else if (full && rest > 0) {
            result += "không trăm";
        }

        // Hàng chục
        if (tens > 1) {
            result += " " + ones[tens] + " mươi";
            if (unit === 1) {
                result += " mốt";
            } else if (unit === 5) {
                result += " lăm";
            } else if (unit > 0) {
                result += " " + ones[unit];
            }
        } 
        else if (tens === 1) {
            result += " mười";
            if (unit === 5) {
                result += " lăm";
            } else if (unit > 0) {
                result += " " + ones[unit];
            }
        } 
        else if (unit > 0) {
            if (hundreds > 0 || full) {
                result += " lẻ";
            }
            result += " " + ones[unit];
        }

        return result.trim();
    }


    let units = [
        "",
        "nghìn",
        "triệu",
        "tỷ"
    ];

    let groups = [];
    let temp = number;

    while (temp > 0) {
        groups.push(temp % 1000);
        temp = Math.floor(temp / 1000);
    }

    let result = "";

    for (let i = groups.length - 1; i >= 0; i--) {
        if (groups[i] !== 0) {
            let text = readThreeDigits(
                groups[i],
                i < groups.length - 1
            );

            result += text + " " + units[i] + " ";
        }
    }

        const text = result.trim();

return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}