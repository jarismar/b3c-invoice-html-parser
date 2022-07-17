// Automatically generated, do not edit!
// #PRAGMA#
// SET td_billing_date = "#btgBody > div.infonota > table.detalhes > td.billing_date"
// SET td_raw_value = "#btgBody > div.infonota > table.detalhes > td.tag_raw_value"
// SET td_net_value = "#btgBody > div.infonota > table.detalhes > td.tag_net_value"
// SET td_tx_setFee = "#btgBody > div.infonota > table.detalhes > td.td_tx_setFee"
// SET td_tx_emolFee = "#btgBody > div.infonota > table.detalhes > td.td_tx_emolFee"
// SET td_tx_brkFee = "#btgBody > div.infonota > table.detalhes > td.td_tx_brkFee"
// SET td_tx_issspFee = "#btgBody > div.infonota > table.detalhes > td.td_tx_issspFee"
// SET td_tx_irrfFee = "#btgBody > div.infonota > table.detalhes > td.td_tx_irrfFee"
// #END#

const rTags = {};

const selectors = {};

function rpadz(s) {
  let ls = String(s);
  while (ls.length < 9) {
    ls = "0".concat(ls);
  }
  return ls;
}

function numberFormat(s) {
  const ls = s.trim().replace(".", "").replace(",", ".");
  const v = parseFloat(ls, 10);
  if (isNaN(v)) {
    throw new Error("Invalid call to numberFormat");
  }
  return v;
}

function intFormat(s) {
  const ls = s.trim();
  const v = parseInt(ls, 10);
  if (isNaN(v)) {
    throw new Error("Invalid call to intFormat");
  }
  return v;
}

function getInvoiceNumber() {
  const invoiceNumberStr = document
    .querySelector(selectors.invoiceNumber)
    .innerText.split("\n")[1];
  const invoiceNumber = parseInt(invoiceNumberStr, 10);
  if (isNaN(invoiceNumber)) {
    throw new Error("Invoice number not found");
  }

  return invoiceNumber;
}

function getMarketDate() {
  const marketDateStr = document
    .querySelector(selectors.marketDate)
    .innerText.split("\n")[1];
  const [d, m, y] = marketDateStr.split("/");
  const marketDate = Date.parse(`${y}-${m}-${d}`);
  if (isNaN(marketDate)) {
    throw new Error("Market date not found");
  }

  return new Date(marketDate);
}

function getMarketDateOutput() {
  const marketDate = getMarketDate();
  const [y, m, d] = marketDate.toISOString().split("T")[0].split("-");
  return `${y}-${m}-${d}T10:00:00-03:00`;
}

function getFileName() {
  const marketDate = getMarketDate();
  const [y, m, d] = marketDate.toISOString().split("T")[0].split("-");
  const invoiceNumberStr = rpadz(getInvoiceNumber());
  return `${y}_${m}_${d}_${invoiceNumberStr}`;
}

function getBillingDate() {
  const billingDateStr = document
    .querySelector(selectors.billingDate)
    .innerText.split(" ")[2]
    .trim();
  const [d, m, y] = billingDateStr.split("/");
  const billingDate = Date.parse(`${y}-${m}-${d}`);
  if (isNaN(billingDate)) {
    throw new Error("Billing date not found");
  }

  return new Date(billingDate);
}

function getBillingDateOutput() {
  const billingDate = getBillingDate();
  const [y, m, d] = billingDate.toISOString().split("T")[0].split("-");
  return `${y}-${m}-${d}T10:00:00-03:00`;
}

function getAgentId() {
  return selectors.agentId;
}

function getRawValue() {
  const rawValueStr = document.querySelector(selectors.rawValue).innerText;
  const rawValue = numberFormat(rawValueStr);
  if (isNaN(rawValue)) {
    throw new Error("Net value not found");
  }
  return rawValue;
}

function getNetValue() {
  const netValueStr = document.querySelector(selectors.netValue).innerText;
  const netValue = numberFormat(netValueStr);
  if (isNaN(netValue)) {
    throw new Error("Raw value not found");
  }
  return netValue;
}

function getClient() {
  return selectors.client;
}

function getItems() {
  const tbItems = document.querySelector(selectors.items);
  const rows = tbItems.rows;
  const items = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r].cells;
    const name = cells[5].innerText.trim();
    const code = rTags[name];
    const qty = intFormat(cells[7].innerText);
    const price = numberFormat(cells[8].innerText);
    const debit = cells[10].innerText.trim() === "D";
    items.push({
      company: {
        code,
        name,
      },
      qty,
      price,
      debit,
    });
  }
  return items;
}

function getTaxes() {
  const taxSelectors = [
    { code: "SETFEE", source: "CBLC", selector: selectors.setFee },
    { code: "EMLFEE", source: "SOMA", selector: selectors.emolFee },
    { code: "BRKFEE", source: "CBLC", selector: selectors.brkFee },
    { code: "ISSSPFEE", source: "CBLC", selector: selectors.issspFee },
    { code: "IRRFFEE", source: "CBLC", selector: selectors.irrfFee },
  ];
  return taxSelectors
    .map((ts) => {
      const taxValueStr = document.querySelector(ts.selector).innerText;
      const value = numberFormat(taxValueStr);
      return {
        code: ts.code,
        source: ts.source,
        value,
      };
    })
    .filter((tx) => !!tx.value);
}

function main() {
  try {
    const invoiceNum = getInvoiceNumber();
    const filename = getFileName();
    const marketDate = getMarketDateOutput();
    const billingDate = getBillingDateOutput();
    const agentId = getAgentId();
    const rawValue = getRawValue();
    const netValue = getNetValue();
    const client = getClient();
    const items = getItems();
    const taxes = getTaxes();

    console.log("TEST PASSED!");

    console.log(
      JSON.stringify(
        {
          market: "b3",
          invoiceNum,
          filename,
          marketDate,
          billingDate,
          agentId,
          rawValue,
          netValue,
          client,
          items,
          taxes,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.log("TEST FAILED!");
    console.log(error.message);
    console.log(error.stack);
  }
}

main();
