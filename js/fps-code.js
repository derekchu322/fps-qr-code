const id_dict = {
    "PayloadFormatIndicator": "00",
    "PointofInitiationMethod": "01",
    "MerchantAccountInformation26": "26",
    "MerchantAccountInformation26.GloballyUniqueIdentifier": "00",
    "MerchantAccountInformation26.ClearingCode": "01",
    "MerchantAccountInformation26.FPSIdentifier": "02",
    "MerchantAccountInformation26.PhoneNumber": "03",
    "MerchantAccountInformation26.EmailAddress": "04",
    "MerchantAccountInformation26.MerchantTimeoutTime": "05",
    "MerchantAccountInformation26.EditableTransactionAmountIndicator": "06",
    "MerchantCategoryCode": "52",
    "TransactionCurrency": "53",
    "TransactionAmount": "54",
    "CountryCode": "58",
    "MerchantName": "59",
    "MerchantCity": "60",
    "PostalCode": "61",
    "MerchantInformationLanguageTemplate": "64",
    "MerchantInformationLanguageTemplate.LanguagePreference": "00",
    "MerchantInformationLanguageTemplate.MechantName": "01",
    "MerchantInformationLanguageTemplate.MerchantCity": "02",
    "AdditionalDataFieldTemplate": "62",
    "AdditionalDataFieldTemplate.BillNumber": "01",
    "AdditionalDataFieldTemplate.ReferenceLabel": "05",
    "CRC": "63"
};

String.prototype.pad = function (size) {
    var s = this;
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function dataObj(id, value) {
    var paddedLength = String(value.length).pad(2);
    return String(id + paddedLength + value);
}

// get keys of an object or array
function getkeys(z) {
    var out = [];
    for (var i in z) { out.push(i) };
    return out;
}

// print all inside an object
function visitObjectNodes(data, name) {
    return getkeys(data).reduce(function (olist, k) {
        var v = data[k];
        var prefix = (name === undefined || name === '') ? '' : name + '.';
        if (typeof v === 'object') {
            var children = visitObjectNodes(v, prefix + k).join("");
            if (children !== "")
                olist.push(dataObj(id_dict[prefix+k], children));
        } else { 
            if (v !== "") olist.push(dataObj(id_dict[prefix+k], v));
        }
        return olist;
    }, []);
}

function genPayload(fps_message_obj) {
    msg = visitObjectNodes(fps_message_obj).join("");
    msg += id_dict["CRC"]+"04";
    var crc = crc16(msg).toString(16).pad(4).toUpperCase();
    console.log(msg+crc);
    return (msg + crc);
}

