import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TemplateHandler } from "easy-template-x";
import { numberToVietnameseWords } from "../utils/fomatText.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = new TemplateHandler();

export async function generateWord(customer) {
    const template = fs.readFileSync(
        path.join(__dirname, "../template/template.docx")
    );
    const date = new Date(customer.deliveryDate);
const day = date.getDate().toString().padStart(2, "0");
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const year = date.getFullYear().toString();

const category1 = customer.categories?.[0];
const category2 = customer.categories?.[1];
const category3 = customer.categories?.[2];

const data = {
    cvCode: customer.cvCode,
    cvName: customer.cvName,
    shipToName: customer.address.split("[")[0].trim(),
    licensePlate: customer.licensePlate,

    totalQty: customer.totalQuantity,
    totalWgt: customer.totalWeight,
    totalWeightText: numberToVietnameseWords(customer.totalWeight),

    category1: category1?.category ?? "",
    package1: category1 ? "Túi" : "",
    quantity1: category1?.quantity ?? "",
    weight1: category1?.weight ?? "",
    purpose1: category1 ? "Thực Phẩm" : "",

    category2: category2?.category ?? "",
    package2: category2 ? "Túi" : "",
    quantity2: category2?.quantity ?? "",
    weight2: category2?.weight ?? "",
    purpose2: category2 ? "Thực Phẩm" : "",

    category3: category3?.category ?? "",
    package3: category3 ? "Túi" : "",
    quantity3: category3?.quantity ?? "",
    weight3: category3?.weight ?? "",
    purpose3: category3 ? "Thực Phẩm" : "",

    day,
    month,
    year,
};

    const doc = await handler.process(template, data);

    return doc;
}