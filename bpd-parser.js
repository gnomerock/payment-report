var base64 = require('base-64');

class BPDParser {

  constructor(encodedBase64) {
    this.stringData = base64.decode(encodedBase64)
  }

  getRawData() {
    return this.stringData
  }

  getData() {
    let result = []
    let stringData = this.stringData
    let rows = stringData.split('\n')
    rows.forEach(function(row) {
      let record = {}
      record.type = row.substring(0,1)
      switch (record.type) {
        case 'H': //Header
          record.sequenceNo     = row.substring(1,7)            //First sequence No.
          record.bankCode       = row.substring(7,10)           //'024' = UOB
          record.companyAccount = row.substring(10,20).trim()   //UOB's account number
          record.companyName    = row.substring(20,60).trim()   //UOB's account name
          record.effectiveDate  = row.substring(60,68).trim()   //DDMMYYYY
          record.serviceCode    = row.substring(68,76).trim()   //abbreviated company name
          record.spare          = row.substring(76,256).trim()
          break;
        case 'D': //Detail
          record.sequenceNo         = row.substring(1,7)            //Running Sequence No.
          record.bankCode           = row.substring(7,10)           //'024' = UOB
          record.companyAccount     = row.substring(10,20).trim()   //UOB's account number
          record.paymentDate        = row.substring(20,28)          //DDMMYYYY payment date
          record.paymentTime        = row.substring(28,34)          //HHMMSS payment time
          record.customerName       = row.substring(34,84).trim()   //customer name
          record.customerRef        = row.substring(84,104).trim()  //customer ref1
          record.ref2               = row.substring(104,124).trim() //ref2
          record.ref3               = row.substring(124,144).trim() //ref2
          record.branchNo           = row.substring(144,148)
          record.tellerNo           = row.substring(148,152)
          record.kindOfTransaction  = row.substring(152,153)         //'C' = credit, 'D' = debit
          record.transactionCode    = row.substring(153,156)         //list of value ('CSH','TRF,CHQ')
          record.chequeNo           = row.substring(156,163)         //when implement 8digit cheque no it will show only last 7 digits ex.( 12345678 will be shown 2345678)
          record.amount             = row.substring(163,176)
          record.spare              = row.substring(176,246).trim()
          record.chequeNo10Digits   = row.substring(246,256)         //if cheque has only 7digits it will be fill 000 prefix ex.(2345678 will be shown 0002345678)
          break;
        case 'T': //Total
          record.sequenceNo               = row.substring(1,7)
          record.bankCode                 = row.substring(7,10)
          record.companyAccount           = row.substring(10,20).trim()
          record.totalDebitAmount         = row.substring(20,33)
          record.totalDebitTransaction    = row.substring(33,39)
          record.totalCreditAmount        = row.substring(39,52)
          record.totalCreditTransaction   = row.substring(52,58)
          record.spare                    = row.substring(58,256).trim()
          break;
      }
      if (record && record.type) {
        result.push(record)
      }
    })

    return result
  }

  getReadableData() {
    let data = this.getData()

    return data
  }

}

module.exports = BPDParser
