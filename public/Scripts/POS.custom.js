var availableSchools = [
    "Darlington School,Rome,GA,045",
    "Holy Innocents Episcopal School,Atlanta,GA,073",
    "Northview High School,Johns Creek,GA,642",
    "Ron Clark Academy,Atlanta,GA,439",
    "St. Pius X Catholic High School,Atlanta,GA,152",
    "Atlanta International School,Atlanta,GA,521"
];

var modelUrl = "http://qa.psu.io/app/direct/";
var token = "F83Fnb_VI5"

var isAddressFromPhoneNumber = false;
var isShipFromPhoneNumber = false;


// validate user field
function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length  || value == 0) {
        return { valid: false, msg: "This is a required field" };
    } else {
        return { valid: true, msg: null };
    }
};

// convert to properly rounded fixed decimal places
function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
};

// format as money
Number.prototype.formatMoney = function toMoney(places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

// calculated total prices and taxes
function sumExtendedPrice() {
    var subtotal = 0.0;
    var tax = 0.0;
    var taxRate = 0.0;
    switch ($("#sstate").val()) {
        case "AL":
            taxRate = 0.10;
            break;
        case "AR":
            taxRate = 0.05;
            break;
        case "GA":
            taxRate = 0.07;
            break;
        case "KS":
            taxRate = 0.063;
            break;
        case "MS":
            taxRate = 0.07;
            break;
        case "OK":
            taxRate = 0.045;
            break;
        case "TN":
            taxRate = 0.07;
            break;
        case "TX":
            taxRate = 0.0625;
            break;
        default:
            taxRate = 0.07;
    }

    var isShip = false;
    var isShipSubtotal = 0.0;

    for (var i = 0; i < data.length; i++) {
        subtotal += parseFloat(data[i]["extended"].replace(",",""));
        if (data[i]["taxable"] == "checked" || data[i]["taxable"] == true) { tax += taxRate * parseFloat(data[i]["extended"].replace(",", "")) };
        if (data[i]["ship"] == "checked" || data[i]["ship"] == true) {
            isShip = true;
            isShipSubtotal += parseFloat(data[i]["extended"].replace(",",""))
        };
    };

    if (additionalTenders.length > 0) {
        var amt = 0;
        for (var i = 0; i < additionalTenders.length; i++) {
            amt += parseFloat(additionalTenders[i]['oAmount']);
        }
        subtotal += amt;
        if (additionalTenders.length > 0) {
            $('#giftCard').text('Gift Cards \n' + amt.formatMoney(2));
        } else {
            $('#giftCard').text('Gift Cards');
        }
    } else {
        $('#giftCard').text('Gift Cards');
    };

    var shippingCharge = 0.0;
    if (isShip) {
        switch (true) {
            case (isShipSubtotal == 0):
                shippingCharge = 0.0;
                break;
            case (isShipSubtotal <= 25.00):
                shippingCharge = 7.95;
                break;
            case (isShipSubtotal <= 50.00):
                shippingCharge = 7.95;
                break;
            case (isShipSubtotal <= 75.00):
                shippingCharge = 10.95;
                break;
            case (isShipSubtotal <= 125.00):
                shippingCharge = 10.95;
                break;
            case (isShipSubtotal <= 150.00):
                shippingCharge = 16.95;
                break;
            case (isShipSubtotal <= 200.00):
                shippingCharge = 16.95;
                break;
            default:
                shippingCharge = 0.0;
        }
    }

    if (isNoShipping) {
        shippingCharge = 0.0;
    }
    tax += taxRate * parseFloat(shippingCharge);
    total = subtotal + shippingCharge + tax;

    $('#subtotal').text(subtotal.formatMoney(2));
    if (subtotal < 0) { $('#subtotal').css('color', 'rgb(255,0,0)') } else { $('#subtotal').css('color', 'rgb(0,0,0)') };
    $('#tenderTax').text(tax.formatMoney(2));
    if (tax < 0) { $('#tenderTax').css('color', 'rgb(255,0,0)') } else { $('#tenderTax').css('color', 'rgb(0,0,0)') };
    $('#shipping').text(shippingCharge.formatMoney(2));
    if (shippingCharge < 0) { $('#shipping').css('color', 'rgb(255,0,0)') } else { $('#shipping').css('color', 'rgb(0,0,0)') };
    $('#total').text(total.formatMoney(2));
    if (total < 0) { $('#total').css('color', 'rgb(255,0,0)') } else { $('#total').css('color', 'rgb(0,0,0)') };
    if (total != 0) { $('#btnPay').show('slow'); } else { $('#btnPay').hide('slow'); }
};

// attempt to close the app on Exit button
function closeApp() {
    window.open("", "_self", "");
    window.close();
    self.close();
};

// clear out customer info
function clearCustomer() {
    $('#residential').prop("checked", true);
    $('#business').prop("checked", false);
    $('#male').prop("checked", true);
    $('#female').prop("checked", false);
    $('#gradesComboBox').val('all');
    $('#phone').val("");
    $('#altphone').val("");
    $('#lastName').val("");
    $('#firstName').val("");
    $('#address1').val("");
    $('#address2').val("");
    $('#city').val("");
    $('#state').val("");
    $('#zipCode').val("");
    $('#country').val("US");
    $('#email').val("");
    $('#bschool').val("");
    $('#cschool').val("");
    $('#sresidential').prop("checked", true);
    $('#sbusiness').prop("checked", false);
    $('#sphone').val("");
    $('#saltphone').val("");
    $('#slastName').val("");
    $('#sfirstName').val("");
    $('#saddress1').val("");
    $('#saddress2').val("");
    $('#scity').val("");
    $('#sstate').val("");
    $('#szipCode').val("");
    $('#scountry').val("");
    $('#semail').val("");
    $('#customerNotes').val("");
    $('#orderNotes').val("");
    $('#international').prop("checked",false);
    $('#shipinternational').prop("checked", false);
    is_downloaded_customer = false;
    is_downloaded_shipto = false;
    CurrentSchool = '';
    CurrentSchoolId = '';
    CustomerSchool = '';
    CustomerSchoolId = '';
    MainFirstTeleDigitZero = false;
    ShipFirstTeleDigitZero = false;
    FirstTeleDigitZero = false;
    $('#phonelabel').css('color', 'black');
    $('#lastnamelabel').css('color', 'black');
    $('#firstnamelabel').css('color', 'black');
    $('#address1label').css('color', 'black');
    $('#citylabel').css('color', 'black');
    $('#statelabel').css('color', 'black');
    $('#zipcodelabel').css('color', 'black');
    $('#countrylabel').css('color', 'black');
    $('#cschoollabel').css('color', 'black');
    $('#sphonelabel').css('color', 'black');
    $('#slastnamelabel').css('color', 'black');
    $('#sfirstnamelabel').css('color', 'black');
    $('#saddress1label').css('color', 'black');
    $('#scitylabel').css('color', 'black');
    $('#sstatelabel').css('color', 'black');
    $('#szipcodelabel').css('color', 'black');
    $('#scountrylabel').css('color', 'black');
    isPhoneNumberError = false;
    isAddressFromPhoneNumber = false;
    isShipFromPhoneNumber = false;
    addrs1Parsed = false;
    addrs2Parsed = false;
    saddrs1Parsed = false;
    saddrs2Parsed = false;
    $('#phone').focus();
};

function clearOrder() {
    $('#oPaid').val("");
    data.length = 0;
    grid.invalidate();
    grid.render();
    data2.length = 0;
    grid2.invalidate();
    grid2.render();
    total = 0.0;
    findItemState = 0;
    categories.length = 0;
    products.length = 0;
    styles.length = 0;
    colors.length = 0;
    sizes.length = 0;
    skus.length = 0;
    additionalTenders = [];
    addTendersPointer = 0;
    $('#giftCard').text('Gift Card');
    grid.gotoCell(data.length, 0, false);
    clearCustomer();
    $('#btnReturn').css('background-color', '#c0c0c0');
    $('#btnReturn').css('color', '#000000');
    sumExtendedPrice();
};

// parse customer address
function parseAddress(address) {
    if (address == '') { return }
    address = address.toUpperCase().replace(".", "");
    var ptr = address.lastIndexOf(" ");
    var first = '';
    var last = '';
    var work = '';
    if (ptr > 0) {
        first = address.slice(0, ptr);
        last = address.slice(ptr);
    } else {
        first = address;
    }
    last = last.replace('NORTHEAST', 'NE');
    last = last.replace('NORTHWEST', 'NW');
    last = last.replace('SOUTHEAST', 'SE');
    last = last.replace('SOUTHWEST', 'SW');
    last = last.replace('NORTH', 'N');
    last = last.replace('SOUTH', 'S');
    last = last.replace('EAST', 'E');
    last = last.replace('WEST', 'W');

    work = address.slice(0, ptr) + last + ' ';

    work = work.replace(' NORTHEAST ', 'NE');
    work = work.replace(' NORTHWEST ', 'NW');
    work = work.replace(' SOUTHEAST ', 'SE');
    work = work.replace(' SOUTHWEST ', 'SW');
    work = work.replace(' NORTH ', 'N');
    work = work.replace(' SOUTH ', 'S');
    work = work.replace(' EAST ', 'E');
    work = work.replace(' WEST ', 'W');
    work = work.replace(' ALLEE ', ' ALY ');
    work = work.replace(' ALLEY ', ' ALY ');
    work = work.replace(' ALLY ', ' ALY ');
    work = work.replace(' ANEX ', ' ANX ');
    work = work.replace(' ANNEX ', ' ANX ');
    work = work.replace(' ANNX ', ' ANX ');
    work = work.replace(' ARCADE ', ' ARC ');
    work = work.replace(' AVENUE ', ' AVE ');
    work = work.replace(' AVENU ', ' AVE ');
    work = work.replace(' AVEN ', ' AVE ');
    work = work.replace(' AVNUE ', ' AVE ');
    work = work.replace(' AVN ', ' AVE ');
    work = work.replace(' AV ', ' AVE ');
    work = work.replace(' BAYOO ', ' BYU ');
    work = work.replace(' BAYOU ', ' BYU ');
    work = work.replace(' BEACH ', ' BCH ');
    work = work.replace(' BEND ', ' BND ');
    work = work.replace(' BLUFF ', ' BLF ');
    work = work.replace(' BLUF ', ' BLF ');
    work = work.replace(' BLUFFS ', ' BLFS ');
    work = work.replace(' BOT ', ' BTM ');
    work = work.replace(' BOTTM ', ' BTM ');
    work = work.replace(' BOTTOM ', ' BTM ');
    work = work.replace(' BOULEVARD ', ' BLVD ');
    work = work.replace(' BOULV ', ' BLVD ');
    work = work.replace(' BOUL ', ' BLVD ');
    work = work.replace(' BRNCH ', ' BR ');
    work = work.replace(' BRANCH ', ' BR ');
    work = work.replace(' BRDGE ', ' BRG ');
    work = work.replace(' BRIDGE ', ' BRG ');
    work = work.replace(' BROOKS ', ' BRKS ');
    work = work.replace(' BROOK ', ' BRK ');
    work = work.replace(' BURGS ', ' BGS ');
    work = work.replace(' BURG ', ' BG ');
    work = work.replace(' BYPASS ', ' BYP ');
    work = work.replace(' BYPAS ', ' BYP ');
    work = work.replace(' BYPA ', ' BYP ');
    work = work.replace(' BYPS ', ' BYP ');
    work = work.replace(' CAMP ', ' CP ');
    work = work.replace(' CMP ', ' CP ');
    work = work.replace(' CANYN ', ' CYN ');
    work = work.replace(' CANYON ', ' CYN ');
    work = work.replace(' CNYN ', ' CYN ');
    work = work.replace(' CAPE ', ' CPE ');
    work = work.replace(' CAUSEWAY ', ' CSWY ');
    work = work.replace(' CAUSWA ', ' CSWY ');
    work = work.replace(' CENTERS ', ' CTRS ');
    work = work.replace(' CENTER ', ' CTR ');
    work = work.replace(' CENTRE ', ' CTR ');
    work = work.replace(' CENTR ', ' CTR ');
    work = work.replace(' CENT ', ' CTR ');
    work = work.replace(' CEN ', ' CTR ');
    work = work.replace(' CNTER ', ' CTR ');
    work = work.replace(' CNTR ', ' CTR ');
    work = work.replace(' CIRCLES ', ' CIRS ');
    work = work.replace(' CIRCLE ', ' CIR ');
    work = work.replace(' CIRCL ', ' CIR ');
    work = work.replace(' CIRC ', ' CIR ');
    work = work.replace(' CRCLE ', ' CIR ');
    work = work.replace(' CRCL ', ' CIR ');
    work = work.replace(' CLIFF ', ' CLF ');
    work = work.replace(' CLIFFS ', ' CLFS ');
    work = work.replace(' CLUB ', ' CLB ');
    work = work.replace(' COMMONS ', ' CMNS ');
    work = work.replace(' COMMON ', ' CMN ');
    work = work.replace(' CORNERS ', ' CORS ');
    work = work.replace(' CORNER ', ' COR ');
    work = work.replace(' COURSE ', ' CRSE ');
    work = work.replace(' COURTS ', ' CTS ');
    work = work.replace(' COURT ', ' CT ');
    work = work.replace(' COVES ', ' CVS ');
    work = work.replace(' COVE ', ' CV ');
    work = work.replace(' CREEK ', ' CRK ');
    work = work.replace(' CRESCENT ', ' CRES ');
    work = work.replace(' CRSENT ', ' CRES ');
    work = work.replace(' CRSNT ', ' CRES ');
    work = work.replace(' CREST ', ' CRST ');
    work = work.replace(' CROSSING ', ' XING ');
    work = work.replace(' CRSSNG ', ' XING ');
    work = work.replace(' CROSSROADS ', ' XRDS ');
    work = work.replace(' CROSSROAD ', ' XRD ');
    work = work.replace(' CURVE ', ' CURV ');
    work = work.replace(' DALE ', ' DL ');
    work = work.replace(' DAM ', ' DM ');
    work = work.replace(' DIVIDE ', ' DV ');
    work = work.replace(' DIV ', ' DV ');
    work = work.replace(' DVD ', ' DV ');
    work = work.replace(' DRIV ', ' DR ');
    work = work.replace(' DRIVES ', ' DRS ');
    work = work.replace(' DRIVE ', ' DR ');
    work = work.replace(' DRV ', ' DR ');
    work = work.replace(' ESTATES ', ' ESTS ');
    work = work.replace(' ESTATE ', ' EST ');
    work = work.replace(' EXPRESSWAY ', ' EXPY ');
    work = work.replace(' EXPRESS ', ' EXPY ');
    work = work.replace(' EXPR ', ' EXPY ');
    work = work.replace(' EXPW ', ' EXPY ');
    work = work.replace(' EXP ', ' EXPY ');
    work = work.replace(' EXTENSIONS ', ' EXTS ');
    work = work.replace(' EXTENSION ', ' EXT ');
    work = work.replace(' EXTNSN ', ' EXT ');
    work = work.replace(' EXTN ', ' EXT ');
    work = work.replace(' FALLS ', ' FLS ');
    work = work.replace(' FERRY ', ' FRY ');
    work = work.replace(' FRRY ', ' FRY ');
    work = work.replace(' FIELDS ', ' FLDS ');
    work = work.replace(' FIELD ', ' FLD ');
    work = work.replace(' FLATS ', ' FLTS ');
    work = work.replace(' FLAT ', ' FLT ');
    work = work.replace(' FORDS ', ' FRDS ');
    work = work.replace(' FORD ', ' FRD ');
    work = work.replace(' FORESTS ', ' FRST ');
    work = work.replace(' FOREST ', ' FRST ');
    work = work.replace(' FORGES ', ' FRGS ');
    work = work.replace(' FORGE ', ' FRG ');
    work = work.replace(' FORG ', ' FRG ');
    work = work.replace(' FORKS ', ' FRKS ');
    work = work.replace(' FORK ', ' FRK ');
    work = work.replace(' FORT ', ' FT ');
    work = work.replace(' FRT ', ' FT ');
    work = work.replace(' FREEWAY ', ' FWY ');
    work = work.replace(' FREEWY ', ' FWY ');
    work = work.replace(' FRWAY ', ' FWY ');
    work = work.replace(' FRWY ', ' FWY ');
    work = work.replace(' GARDENS ', ' GDNS ');
    work = work.replace(' GRDNS ', ' GDNS ');
    work = work.replace(' GARDEN ', ' GDN ');
    work = work.replace(' GARDN ', ' GDN ');
    work = work.replace(' GRDEN ', ' GDN ');
    work = work.replace(' GRDN ', ' GDN ');
    work = work.replace(' GATEWAY ', ' GTWY ');
    work = work.replace(' GATEWY ', ' GTWY ');
    work = work.replace(' GATWAY ', ' GTWY ');
    work = work.replace(' GTWAY ', ' GTWY ');
    work = work.replace(' GLENS ', ' GLNS ');
    work = work.replace(' GLEN ', ' GLN ');
    work = work.replace(' GREENS ', ' GRNS ');
    work = work.replace(' GREEN ', ' GRN ');
    work = work.replace(' GROVES ', ' GRVS ');
    work = work.replace(' GROVE ', ' GRV ');
    work = work.replace(' GROV ', ' GRV ');
    work = work.replace(' HARBORS ', ' HBRS ');
    work = work.replace(' HARBOR ', ' HBR ');
    work = work.replace(' HARBR ', ' HBR ');
    work = work.replace(' HARB ', ' HBR ');
    work = work.replace(' HRBOR ', ' HBR ');
    work = work.replace(' HAVEN ', ' HVN ');
    work = work.replace(' HT ', ' HTS ');
    work = work.replace(' HEIGHTS ', ' HTS ');
    work = work.replace(' HIGHWAY ', ' HWY ');
    work = work.replace(' HIGHWY ', ' HWY ');
    work = work.replace(' HIWAY ', ' HWY ');
    work = work.replace(' HIWY ', ' HWY ');
    work = work.replace(' HWAY ', ' HWY ');
    work = work.replace(' HILL ', ' HL ');
    work = work.replace(' HILLS ', ' HLS ');
    work = work.replace(' HOLLOWS ', ' HOLW ');
    work = work.replace(' HOLLOW ', ' HOLW ');
    work = work.replace(' HLLW ', ' HOLW ');
    work = work.replace(' HOLWS ', ' HOLW ');
    work = work.replace(' INLET ', ' INLT ');
    work = work.replace(' ISLANDS ', ' ISS ');
    work = work.replace(' ISLNDS ', ' ISS ');
    work = work.replace(' ISLAND ', ' IS ');
    work = work.replace(' ISLND ', ' IS ');
    work = work.replace(' ISLES ', ' ISLE ');
    work = work.replace(' JUNCTIONS ', ' JCTS ');
    work = work.replace(' JCTNS ', ' JCTS ');
    work = work.replace(' JCTION ', ' JCT ');
    work = work.replace(' JCTN ', ' JCT ');
    work = work.replace(' JUNCTION ', ' JCT ');
    work = work.replace(' JUNCTN ', ' JCT ');
    work = work.replace(' JUNCTON ', ' JCT ');
    work = work.replace(' KEYS ', ' KYS ');
    work = work.replace(' KEY ', ' KY ');
    work = work.replace(' KNOLLS ', ' KNLS ');
    work = work.replace(' KNOLL ', ' KNL ');
    work = work.replace(' KNOL ', ' KNL ');
    work = work.replace(' LAKES ', ' LKS ');
    work = work.replace(' LAKE ', ' LK ');
    work = work.replace(' LANDING ', ' LNDG ');
    work = work.replace(' LNDNG ', ' LNDG ');
    work = work.replace(' LANE ', ' LN ');
    work = work.replace(' LIGHTS ', ' LGTS ');
    work = work.replace(' LIGHT ', ' LGT ');
    work = work.replace(' LOAF ', ' LF ');
    work = work.replace(' LOCKS ', ' LCKS ');
    work = work.replace(' LOCK ', ' LCK ');
    work = work.replace(' LODGE ', ' LDG ');
    work = work.replace(' LODG ', ' LDG ');
    work = work.replace(' LDGE ', ' LDG ');
    work = work.replace(' LOOPS ', ' LOOP ');
    work = work.replace(' MANORS ', ' MNRS ');
    work = work.replace(' MANOR ', ' MNR ');
    work = work.replace(' MEADOWS ', ' MDWS ');
    work = work.replace(' MEDOWS ', ' MDWS ');
    work = work.replace(' MEADOW ', ' MDW ');
    work = work.replace(' MDW ', ' MDW ');
    work = work.replace(' MILLS ', ' MLS ');
    work = work.replace(' MILL ', ' ML ');
    work = work.replace(' MISSION ', ' MSN ');
    work = work.replace(' MSSN ', ' MSN ');
    work = work.replace(' MOTORWAY ', ' MTWY ');
    work = work.replace(' MOUNTAINS ', ' MTNS ');
    work = work.replace(' MNTNS ', ' MTNS ');
    work = work.replace(' MOUNTAIN ', ' MTN ');
    work = work.replace(' MOUNTIN ', ' MTN ');
    work = work.replace(' MOUNT ', ' MT ');
    work = work.replace(' MNTAIN ', ' MTN ');
    work = work.replace(' MNTN ', ' MTN ');
    work = work.replace(' MNT ', ' MT ');
    work = work.replace(' MTIN ', ' MTN ');
    work = work.replace(' NECK ', ' NCK ');
    work = work.replace(' ORCHARD ', ' ORCH ');
    work = work.replace(' ORCHRD ', ' ORCH ');
    work = work.replace(' OVL ', ' 0VAL ');
    work = work.replace(' OVERPASS ', ' OPAS ');
    work = work.replace(' PRK ', ' PARK ');
    work = work.replace(' PARKS ', ' PARK ');
    work = work.replace(' PARKWAY ', ' PKWY ');
    work = work.replace(' PARKWY ', ' PKWY ');
    work = work.replace(' PKWAY ', ' PKWY ');
    work = work.replace(' PKY ', ' PKWY ');
    work = work.replace(' PARKWAYS ', ' PKWY ');
    work = work.replace(' PKWYS ', ' PKWY ');
    work = work.replace(' PASSAGE ', ' PSGE ');
    work = work.replace(' PATHS ', ' PATH ');
    work = work.replace(' PIKES ', ' PIKE ');
    work = work.replace(' PINES ', ' PNES ');
    work = work.replace(' PINE ', ' PNE ');
    work = work.replace(' PLACE ', ' PL ');
    work = work.replace(' PLAINS ', ' PLNS ');
    work = work.replace(' PLAIN ', ' PLN ');
    work = work.replace(' PLAZA ', ' PLZ ');
    work = work.replace(' PLZA ', ' PLZ ');
    work = work.replace(' POINTES ', ' PTS ');
    work = work.replace(' POINTS ', ' PTS ');
    work = work.replace(' POINTE ', ' PT ');
    work = work.replace(' POINT ', ' PT ');
    work = work.replace(' PTE ', ' PT ');
    work = work.replace(' PORTS ', ' PRTS ');
    work = work.replace(' PORT ', ' PRT ');
    work = work.replace(' PRAIRIE ', ' PR ');
    work = work.replace(' PRR ', ' PR ');
    work = work.replace(' RADIAL ', ' RADL ');
    work = work.replace(' RADIEL ', ' RADL ');
    work = work.replace(' RAD ', ' RADL ');
    work = work.replace(' RANCHES ', ' RNCH ');
    work = work.replace(' RANCH ', ' RNCH ');
    work = work.replace(' RNCHS ', ' RNCH ');
    work = work.replace(' RAPIDS ', ' RPDS ');
    work = work.replace(' RAPID ', ' RPD ');
    work = work.replace(' REST ', ' RST ');
    work = work.replace(' RIDGES ', ' RDGS ');
    work = work.replace(' RIDGE ', ' RDG ');
    work = work.replace(' RDGE ', ' RDG ');
    work = work.replace(' RIVER ', ' RIV ');
    work = work.replace(' RVR ', ' RIV ');
    work = work.replace(' RIVR ', ' RIV ');
    work = work.replace(' ROADS ', ' RDS ');
    work = work.replace(' ROAD ', ' RD ');
    work = work.replace(' ROUTE ', ' RTE ');
    work = work.replace(' SHOALS ', ' SHLS ');
    work = work.replace(' SHOAL ', ' SHL ');
    work = work.replace(' SHORES ', ' SHRS ');
    work = work.replace(' SHOARS ', ' SHRS ');
    work = work.replace(' SHORE ', ' SHR ');
    work = work.replace(' SHOAR ', ' SHR ');
    work = work.replace(' SKYWAY ', ' SKWY ');
    work = work.replace(' SPRINGS ', ' SPGS ');
    work = work.replace(' SPRNGS ', ' SPGS ');
    work = work.replace(' SPRING ', ' SPG ');
    work = work.replace(' SPRNG ', ' SPG ');
    work = work.replace(' SPNGS ', ' SPGS ');
    work = work.replace(' SPNG ', ' SPG ');
    work = work.replace(' SPURS ', ' SPUR ');
    work = work.replace(' SQUARES ', ' SQS ');
    work = work.replace(' SQRS ', ' SQS ');
    work = work.replace(' SQR ', ' SQ ');
    work = work.replace(' SQRE ', ' SQ ');
    work = work.replace(' SQU ', ' SQ ');
    work = work.replace(' SQUARE ', ' SQ ');
    work = work.replace(' STATION ', ' STA ');
    work = work.replace(' STATN ', ' STA ');
    work = work.replace(' STN ', ' STA ');
    work = work.replace(' STRAVENUE ', ' STRA ');
    work = work.replace(' STRAVEN ', ' STRA ');
    work = work.replace(' STRAVN ', ' STRA ');
    work = work.replace(' STRAV ', ' STRA ');
    work = work.replace(' STRVNUE ', ' STRA ');
    work = work.replace(' STRVN ', ' STRA ');
    work = work.replace(' STREAM ', ' STRM ');
    work = work.replace(' STREME ', ' STRM ');
    work = work.replace(' STREETS ', ' STS ');
    work = work.replace(' STREET ', ' ST ');
    work = work.replace(' STRT ', ' ST ');
    work = work.replace(' STR ', ' ST ');
    work = work.replace(' SUMMIT ', ' SMT ');
    work = work.replace(' SUMITT ', ' SMT ');
    work = work.replace(' SUMIT ', ' SMT ');
    work = work.replace(' TERRACE ', ' TER ');
    work = work.replace(' TERR ', ' TER ');
    work = work.replace(' THROUGHWAY ', ' TRWY ');
    work = work.replace(' TRACES ', ' TRCE ');
    work = work.replace(' TRACE ', ' TRCE ');
    work = work.replace(' TRACKS ', ' TRAK ');
    work = work.replace(' TRACK ', ' TRAK ');
    work = work.replace(' TRKS ', ' TRAK ');
    work = work.replace(' TRK ', ' TRAK ');
    work = work.replace(' TRAFFICWAY ', ' TRFY ');
    work = work.replace(' TRAILS ', ' TRL ');
    work = work.replace(' TRAIL ', ' TRL ');
    work = work.replace(' TRLS ', ' TRL ');
    work = work.replace(' TRAILER ', ' TRLR ');
    work = work.replace(' TRLRS ', ' TRLR ');
    work = work.replace(' TUNNELS ', ' TUNL ');
    work = work.replace(' TUNNEL ', ' TUNL ');
    work = work.replace(' TUNNL ', ' TUNL ');
    work = work.replace(' TUNLS ', ' TUNL ');
    work = work.replace(' TUNEL ', ' TUNL ');
    work = work.replace(' TURNPIKE ', ' TPKE ');
    work = work.replace(' TURNPK ', ' TPKE ');
    work = work.replace(' TRNPK ', ' TPKE ');
    work = work.replace(' UNDERPASS ', ' UPAS ');
    work = work.replace(' UNIONS ', ' UNS ');
    work = work.replace(' UNION ', ' UN ');
    work = work.replace(' VALLEYS ', ' VLYS ');
    work = work.replace(' VALLEY ', ' VLY ');
    work = work.replace(' VALLY ', ' VLY ');
    work = work.replace(' VLLY ', ' VLY ');
    work = work.replace(' VIADUCT ', ' VIA ');
    work = work.replace(' VIADCT ', ' VIA ');
    work = work.replace(' VDCT ', ' VIA ');
    work = work.replace(' VIEWS ', ' VWS ');
    work = work.replace(' VIEW ', ' VW ');
    work = work.replace(' VILLAGES ', ' VLGS ');
    work = work.replace(' VILLAGE ', ' VLG ');
    work = work.replace(' VILLAG ', ' VLG ');
    work = work.replace(' VILLIAGE ', ' VLG ');
    work = work.replace(' VILLG ', ' VLG ');
    work = work.replace(' VILL ', ' VLG ');
    work = work.replace(' VILLE ', ' VL ');
    work = work.replace(' VISTA ', ' VIS ');
    work = work.replace(' VIST ', ' VIS ');
    work = work.replace(' VSTA ', ' VIS ');
    work = work.replace(' VST ', ' VIS ');
    work = work.replace(' WALKS ', ' WALK ');
    work = work.replace(' WY ', ' WAY ');
    work = work.replace(' WELLS ', ' WLS ');
    work = work.replace(' WELL ', ' WL ');

    work = work.replace(' N ST ', ' NORTH ST ');
    work = work.replace(' N AVE ', ' NORTH AVE ');
    work = work.replace(' N BLVD ', ' NORTH BLVD ');
    work = work.replace(' N HWY ', ' NORTH HWY ');
    work = work.replace(' N SHR ', ' NORTH SHR ');

    work = work.replace(' S ST ', ' SOUTH ST ');
    work = work.replace(' S AVE ', ' SOUTH AVE ');
    work = work.replace(' S BLVD ', ' SOUTH BLVD ');
    work = work.replace(' S HWY ', ' SOUTH HWY ');
    work = work.replace(' S SHR ', ' SOUTH SHR ');

    work = work.replace(' E ST ', ' EAST ST ');
    work = work.replace(' E AVE ', ' EAST AVE ');
    work = work.replace(' E BLVD ', ' EAST BLVD ');
    work = work.replace(' E HWY ', ' EAST HWY ');
    work = work.replace(' E SHR ', ' EAST SHR ');

    work = work.replace(' W ST ', ' WEST ST ');
    work = work.replace(' W AVE ', ' WEST AVE ');
    work = work.replace(' W BLVD ', ' WEST BLVD ');
    work = work.replace(' W HWY ', ' WEST HWY ');
    work = work.replace(' W SHR ', ' WEST SHR ');

    work = work.replace(' APARTMENT ', ' APT ');
    work = work.replace(' APART ', ' APT ');
    work = work.replace(' AP ', ' APT ');
    work = work.replace(' BASEMENT ', ' BSMT ');
    work = work.replace(' BUILDING ', ' BLDG ');
    work = work.replace(' DEPARTMENT ', ' DEPT ');
    work = work.replace(' FLOOR ', ' FLR ');
    //work = work.replace(' FRONT ', ' FRNT ');
    work = work.replace(' HANGAR ', ' HNGR ');
    work = work.replace(' LOBBY ', ' LBBY ');
    //work = work.replace(' LOWER ', ' LOWR ');
    work = work.replace(' OFFICE ', ' OFC ');
    work = work.replace(' PENTHOUSE ', ' PH ');
    work = work.replace(' ROOM ', ' RM ');
    work = work.replace(' SPACE ', ' SPC ');
    work = work.replace(' SUITE ', ' STE ');
    work = work.replace(' TRAILER ', ' TRLR ');
    //work = work.replace(' UPPER ', ' UPPR ');

    return $.trim(work);
};

// Notes, Payment
function createPopupDialog(url, params) {
    var oReturnValue = {};
    if (navigator.userAgent.indexOf("Firefox") > 0) {
        // Firefox
        oReturnValue = window.showModalDialog(url, params, "center:yes; scroll:no; resizeable:no;");
        //,titlebar=no;resizable=no,toolbar=no,status=no,menubar=no,resizable=no,directories=no,location=no,titlebar=no,scrollbars=no,personalbar=no,dialog=no,dependent=no,modal=yes,z-lock:yes');
        // Change dom.disable_window_open_feature.location to false in about:config
    }
    else if (navigator.userAgent.indexOf("Chrome") > 0) {
            // Safari, Chrome Canary
        oReturnValue = window.showModalDialog(url, params, 'dialogheight:768,dialogwidth=1024,toolbar=no,status=no,menubar=no,resizable=no,directories=no,location=no,titlebar=no,scrollbars=no');
    }
    else {
        // Internet Explorer
        oReturnValue = window.showModalDialog(url, params, 'dialogheight:768px; dialogwidth:1024px; toolbar:no; status:no; menubar:no; resizable:no; directories:no; location:no; titlebar:no; scrollbars:no; unadorned:yes;');
    }

    return oReturnValue;
};

// Schools
$(function () {
    $('#cschool').autocomplete({
        source: availableSchools,
        select: function (event, ui) {
            var evt = event ? event : win.event;
            if (evt.stopPropagation) evt.stopPropagation();
            if (evt.cancelBubble != null) evt.cancelBubble = true;
            var namePtr = ui.item.value.indexOf(',');
            $('#cschool').val(ui.item.value.substring(0, namePtr));
            $('#bschool').val(ui.item.value.substring(0, namePtr));
            CurrentSchool = ui.item.value.substring(0, namePtr);
            CustomerSchool = CurrentSchool;
            var statePtr = ui.item.value.indexOf(',', namePtr + 1);
            var idPtr = ui.item.value.indexOf(',', statePtr + 1);
            CurrentSchoolId = ui.item.value.substring(idPtr + 1);
            CustomerSchoolId = CurrentSchoolId;
            return false;
        }
    });
});
$(function () {
    $('#bschool').autocomplete({
        source: availableSchools,
        select: function (event, ui) {
            var evt = event ? event : win.event;
            if (evt.stopPropagation) evt.stopPropagation();
            if (evt.cancelBubble != null) evt.cancelBubble = true;
            var namePtr = ui.item.value.indexOf(',');
            $('#bschool').val(ui.item.value.substring(0, namePtr));
            CurrentSchool = ui.item.value.substring(0, namePtr);
            var statePtr = ui.item.value.indexOf(',', namePtr + 1);
            var idPtr = ui.item.value.indexOf(',', statePtr + 1);
            CurrentSchoolId = ui.item.value.substring(idPtr + 1);
            return false;
        }
    });
});

// City, State, Country selection
$(function () {
    $("#city").autocomplete({
        source: function (request, response) {
            var countryText = $("#country").val();
            if (!countryText) {
                countryText = "US"
            }
            $.ajax({
                url: "http://ws.geonames.org/searchJSON",
                dataType: "jsonp",
                data: {
                    featureClass: "P",  //city, village ....
                    style: "full",      //verbosity of returned data
                    maxRows: 10,        //max rows returned
                    name_startsWith: request.term,
                    country: countryText
                },
                success: function (data) {
                    response($.map(data.geonames, function (item) {
                        return {
                            lat: item.lat,
                            lng: item.lng,
                            label: item.name.toUpperCase() + (item.adminName1.toUpperCase() ? ", " + item.adminName1.toUpperCase() : ""),
                            value: item.name.toUpperCase(),
                            state: item.adminCode1.toUpperCase(),
                            country: item.countryCode.toUpperCase()
                        }
                    }));
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $("#state").val(ui.item.state);
            $("#country").val(ui.item.country);
            getZip(ui.item.lat, ui.item.lng);
        }
    })
});
$(function () {
    $("#scity").autocomplete({
        source: function (request, response) {
            var countryText = $("#scountry").val();
            if (!countryText) {
                countryText = "US"
            }
            $.ajax({
                url: "http://ws.geonames.org/searchJSON",
                dataType: "jsonp",
                data: {
                    featureClass: "P",  //city, village ....
                    style: "full",      //verbosity of returned data
                    maxRows: 10,        //max rows returned
                    name_startsWith: request.term,
                    country: countryText
                },
                success: function (data) {
                    response($.map(data.geonames, function (item) {
                        return {
                            lat: item.lat,
                            lng: item.lng,
                            label: item.name.toUpperCase() + (item.adminName1.toUpperCase() ? ", " + item.adminName1.toUpperCase() : ""),
                            value: item.name.toUpperCase(),
                            state: item.adminCode1.toUpperCase(),
                            country: item.countryCode.toUpperCase()
                        }
                    }));
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $("#sstate").val(ui.item.state);
            $("#scountry").val(ui.item.country);
            getsZip(ui.item.lat, ui.item.lng);
        }
    })
});

// ZIP Code
function getZip(olat, olng) {
    if ($('#zipCode').val() == "") {
        var request = 'http://api.geonames.org/findNearbyPostalCodesJSON?lat=' + olat + '&lng=' + olng + '&radius=1&maxRows=1&style=short&username=demo&callback=?';
        $.getJSON(request, function (response) {
            if (response.postalCodes != undefined) { $('#zipCode').val(response.postalCodes[0].postalCode); };
        });
        //.error(function () { alert('err'); });
    }
};
function getsZip(olat, olng) {
    if ($('#szipCode').val() == "") {
        var request = 'http://api.geonames.org/findNearbyPostalCodesJSON?lat=' + olat + '&lng=' + olng + '&radius=1&maxRows=1&style=short&username=demo&callback=?';
        $.getJSON(request, function (response) {
            if (response.postalCodes != undefined) { $('#szipCode').val(response.postalCodes[0].postalCode); };
        });
        //.error(function () { alert('err'); });
    }
};

// Get Customer Data from phone
function getCustomer(phoneNumber, dashed, fax) {
    var ptr = dataCust.length;
    var invocation = new XMLHttpRequest();
    if (invocation) {
        $('#waiting').show();
        var request = '{"action":"Customer","method":"read","data":[{"filter":[{"property":"';
        if (fax == false) {
            request += 'phone';
        } else {
            request += 'fax';
        }
        request += '","value":"';
        if (dashed == true) {
            request += replaceAll(phoneNumber, "-", "");
        } else {
            request += phoneNumber;
        };
        request += '"}],"page":1,"start":0,"limit":10';
        request += ',"sort":[{"property":"display","direction":"ASC"}]';
        request += '}],"type":"rpc","tid":1}';
        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.send(request);
        invocation.onreadystatechange = function () {
            if (invocation.readyState == 4) {
                if (invocation.status == 200) {
                    //var ptr = 0;
                    $.map($.parseJSON(invocation.responseText).result.records, function (item) {
                        var phn = "";
                        var olname = "";
                        if (item.last_name != undefined) { olname = item.last_name.toUpperCase() };
                        var ofname = "";
                        if (item.first_name != undefined) { ofname = item.first_name.toUpperCase() };
                        var oad1 = "";
                        if (item.line_1 != undefined) { oad1 = item.line_1.toUpperCase() };
                        var oad2 = "";
                        if (item.line_2 != undefined) { oad2 = item.line_2.toUpperCase() };
                        var ocity = "";
                        if (item.city != undefined) { ocity = item.city.toUpperCase() };
                        var ostate = "";
                        if (item.state_code != undefined) { ostate = item.state_code.toUpperCase() };
                        var ocountry = "";
                        if (item.country != undefined) {
                            ocountry = item.country.toUpperCase();
                            if (ocountry == 'US') {
                                phn = parsePhone(false, item.phone);
                            } else {
                                phn = parsePhone(true, item.phone);
                            }
                        } else {
                            ocountry = "US";
                            phn = parsePhone(false,item.phone);
                        };

                        var lbl = item.display.toUpperCase();
                        if (oad1 != "") { lbl += (" " + oad1) };
                        if (ocity != "") { lbl += (" " + ocity) };
                        if (ostate != "") { lbl += (", " + ostate) };


                        var c = (dataCust[ptr] = {});
                        c['custRes'] = item.is_residential;
                        c['custLastName'] = olname;
                        c['custFirstName'] = ofname;
                        c['custAddress1'] = oad1;
                        c['custAddress2'] = oad2;
                        c['custCity'] = ocity;
                        c['custState'] = ostate;
                        c['custZip'] = item.zip;
                        c['custCountry'] = ocountry;
                        c['custPhone1'] = phn;
                        c['custEmail'] = item.email_address;
                        c['custNbr'] = item.customer_nbr;
                        c['custID'] = item.customer_id;

                        ptr +=1
                    });
                    
                    //handleLastName(xmlHttp.responseText)
                } else if (invocation.status == 500) {
                    showMsg('Internal Server Error.');
                } else if (invocation.status == 503) {
                    showMsg('Sevice Unavailable.');
                } else {
                    showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                }
                $('#waiting').hide();
                gridCust.invalidate();
                gridCust.render();
            }
        };
    } else {
        showMsg('No Invocation TookPlace At All.');
        $('#waiting').hide();
    }
};

// Get Customer Data from name
$(function () {
    $("#lastName").autocomplete({
        source: function (request, response) {
            if (is_downloaded_customer == true) { return };
            var invocation = new XMLHttpRequest();
            if (invocation) {
                $('#waiting').show();
                var request = '{"action":"Customer","method":"read","data":[{"search":{"criteria":"' + $("#lastName").val().toUpperCase() + '"},'
                request += '"page":1,"start":0,"limit":10';
                request += ',"sort":[{"property":"display","direction":"ASC"}]';
                request += '}],"type":"rpc","tid":1}';
                invocation.open('POST', modelUrl, true);
                invocation.setRequestHeader("X-API-TOKEN", token);
                invocation.setRequestHeader("Content-Type", "application/json");
                invocation.send(request);
                invocation.onreadystatechange = function () {
                    if (invocation.readyState == 4) {
                        if (invocation.status == 200) {
                            response($.map($.parseJSON(invocation.responseText).result.records, function (item) {
                                var phn = "";

                                var olname = "";
                                if (item.last_name != undefined) { olname = item.last_name.toUpperCase() };
                                var ofname = "";
                                if (item.first_name != undefined) { ofname = item.first_name.toUpperCase() };
                                var oad1 = "";
                                if (item.line_1 != undefined) { oad1 = item.line_1.toUpperCase() };
                                var oad2 = "";
                                if (item.line_2 != undefined) { oad2 = item.line_2.toUpperCase() };
                                var ocity = "";
                                if (item.city != undefined) { ocity = item.city.toUpperCase() };
                                var ostate = "";
                                if (item.state_code != undefined) { ostate = item.state_code.toUpperCase() };
                                var ocountry = "";
                                if (item.country != undefined) {
                                    ocountry = item.country.toUpperCase();
                                    if (ocountry == 'US') {
                                        phn = parsePhone(false, item.phone);
                                    } else {
                                        phn = parsePhone(true, item.phone);
                                    }
                                } else {
                                    ocountry = "US";
                                    phn = parsePhone(false, item.phone);
                                };

                                var lbl = item.display.toUpperCase();
                                if (oad1 != "") { lbl += (" " + oad1) };
                                if (ocity != "") { lbl += (" " + ocity) };
                                if (ostate != "") { lbl += (", " + ostate) };

                                return {
                                    label: lbl,
                                    value: olname,
                                    personid: item.customer_id,
                                    res: item.is_residential,
                                    lname: olname,
                                    fname: ofname,
                                    ad1: oad1,
                                    ad2: oad2,
                                    city: ocity,
                                    state: ostate,
                                    zip: item.zip,
                                    country: ocountry,
                                    phone: phn,
                                    email: item.email_address,
                                    cnbr: item.customer_nbr,
                                    cid: item.customer_id
                                    //,cschool: item.school,
                                    //cschoolid: item.school_id
                                };
                            }));
                            //handleLastName(xmlHttp.responseText)
                        } else if (invocation.status == 500) {
                            showMsg('Internal Server Error.');
                        } else if (invocation.status == 503) {
                            showMsg('Sevice Unavailable.');
                        } else {
                            showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                        }
                        $('#waiting').hide();
                    }
                };
            } else {
                showMsg('No Invocation TookPlace At All.');
                $('#waiting').hide();
            }
        },
        minLength: 2,
        select: function (event, ui) {
            is_downloaded_customer = true;
            c_altphone = '';
            c_customerNotes = '';
            if (ui.item.res == true) {
                c_residential == true;
                $('#residential').prop('checked', 'checked');
            } else {
                c_residential == false;
                $('#business').prop('checked', 'checked');
            };
            c_lastName = ui.item.lname;
            //$('#lastName').val(c_lastName);
            c_firstName = ui.item.fname;
            $('#firstName').val(c_firstName);
            c_address1 = ui.item.ad1;
            $('#address1').val(c_address1);
            c_address2 = ui.item.ad2;
            $('#address2').val(c_address2);
            c_city = ui.item.city;
            $('#city').val(c_city);
            c_state = ui.item.state;
            $('#state').val(c_state);
            c_zipCode = ui.item.zip;
            $('#zipCode').val(c_zipCode);
            c_country = ui.item.country;
            $('#country').val(c_country);
            c_phone = ui.item.phone;
            $('#phone').val(c_phone);
            c_email = ui.item.email;
            $('#email').val(c_email);
            CustomerNbr = ui.item.cnbr;
            CustomerID = ui.item.cid;
            c_school = "";
            //c_cschool = ui.item.cschool;
            $('#cschool').val(c_cschool);
            CurrentSchool = c_cschool;
            CustomerSchool = c_cschool;
            c_cschoolid = ""
            //c_cschoolid = ui.item.cshcool_id;
            CurrentSchoolId = c_cschoolid;
            CustomerSchoolId = c_cschoolid;

            $('#waiting').hide();
        }
    })
});

function getCustomerSchool(customer_id) {
    var invocation = new XMLHttpRequest();
    if (invocation) {
        $('#waiting').show();
        var request = '{"action":"CustomerSite","method":"read","data":[{"filter":[{"property":"customer_id","value":"' + customer_id;
        request += '"}],"page":1,"start":0,"limit":20}],"type":"rpc","tid":1}';
        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.send(request);
        invocation.onreadystatechange = function () {
            if (invocation.readyState == 4) {
                if (invocation.status == 200) {
                    // see if any school
                    if ($.parseJSON(invocation.responseText).result.length > 0) {
                        $.map($.parseJSON(invocation.responseText).result.records, function (item) {
                            getCustomerSchoolDetail(item.site_id);
                        });
                    }
                    //handleLastName(xmlHttp.responseText)
                } else if (invocation.status == 500) {
                    showMsg('Internal Server Error.');
                } else if (invocation.status == 503) {
                    showMsg('Sevice Unavailable.');
                } else {
                    showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                }
                $('#waiting').hide();
            }
        };
    } else {
        showMsg('No Invocation TookPlace At All.');
        $('#waiting').hide();
    }
};
function getSchoolDetail(site_id) {
    var invocation = new XMLHttpRequest();
    if (invocation) {
        $('#waiting').show();
        var request = '{"action":"Site","method":"read","data":[{"filter":[{"property":"site_id","value":"' + site_id;
        request += '"}],"page":1,"start":0,"limit":10}],"type":"rpc","tid":1}';
        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.send(request);
        invocation.onreadystatechange = function () {
            if (invocation.readyState == 4) {
                if (invocation.status == 200) {
                    // get school details
                    $.map($.parseJSON(invocation.responseText).result.records, function (item) {
                        c_cschool = item.site_name;
                        $('#cschool').val(c_cschool);
                        $('#bschool').val(c_cschool);
                        CurrentSchool = c_cschool;
                        CustomerSchool = c_cschool;
                        c_cschoolid = site_id;
                    });
                    //handleLastName(xmlHttp.responseText)
                } else if (invocation.status == 500) {
                    showMsg('Internal Server Error.');
                } else if (invocation.status == 503) {
                    showMsg('Sevice Unavailable.');
                } else {
                    showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                }
                $('#waiting').hide();
            }
        };
    } else {
        showMsg('No Invocation TookPlace At All.');
        $('#waiting').hide();
    }
};

function getCustomerShipping(customer_id) {
    var ptr = dataShipping.length;
    var invocation = new XMLHttpRequest();
    if (invocation) {
        $('#waiting').show();
        var request = '{"action":"Shipping","method":"read","data":[{"filter":[{"property":"customer_id","value":"' + customer_id;
        request += '"}],"page":1,"start":0,"limit":10}],"type":"rpc","tid":1}';
        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.send(request);
        invocation.onreadystatechange = function () {
            if (invocation.readyState == 4) {
                if (invocation.status == 200) {
                    // get shipping details
                    $.map($.parseJSON(invocation.responseText).result.records, function (item) {
                        var phn = "";
                        var olname = "";
                        if (item.last_name != undefined) { olname = item.last_name.toUpperCase() };
                        var ofname = "";
                        if (item.first_name != undefined) { ofname = item.first_name.toUpperCase() };
                        var oad1 = "";
                        if (item.line_1 != undefined) { oad1 = item.line_1.toUpperCase() };
                        var oad2 = "";
                        if (item.line_2 != undefined) { oad2 = item.line_2.toUpperCase() };
                        var ocity = "";
                        if (item.city != undefined) { ocity = item.city.toUpperCase() };
                        var ostate = "";
                        if (item.state_code != undefined) { ostate = item.state_code.toUpperCase() };
                        var ocountry = "";
                        if (item.country != undefined) {
                            ocountry = item.country.toUpperCase();
                            if (ocountry == 'US') {
                                phn = parsePhone(false, item.phone);
                            } else {
                                phn = parsePhone(true, item.phone);
                            }
                        } else {
                            ocountry = "US";
                            phn = parsePhone(false, item.phone);
                        };

                        var lbl = item.display.toUpperCase();
                        if (oad1 != "") { lbl += (" " + oad1) };
                        if (ocity != "") { lbl += (" " + ocity) };
                        if (ostate != "") { lbl += (", " + ostate) };


                        var c = (dataShipping[ptr] = {});
                        c['custRes'] = item.is_residential;
                        c['custLastName'] = olname;
                        c['custFirstName'] = ofname;
                        c['custAddress1'] = oad1;
                        c['custAddress2'] = oad2;
                        c['custCity'] = ocity;
                        c['custState'] = ostate;
                        c['custZip'] = item.zip;
                        c['custCountry'] = ocountry;
                        c['custPhone1'] = phn;
                        c['custEmail'] = item.email_address;
                        c['custNbr'] = item.customer_nbr;
                        c['custID'] = item.customer_id;

                        ptr += 1
                    });
                    //handleLastName(xmlHttp.responseText)
                } else if (invocation.status == 500) {
                    showMsg('Internal Server Error.');
                } else if (invocation.status == 503) {
                    showMsg('Sevice Unavailable.');
                } else {
                    showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                }
            }
        };
    } else {
        showMsg('No Invocation TookPlace At All.');
        $('#waiting').hide();
    }
};

// Get Product Model Data
function findItemModelData(target, page, column, guid, school, gender, grade, sort) {
    var invocation = new XMLHttpRequest();
    if (invocation) {
        var filter = '';
        var sorted = '';
        var param = '';

        if (sort != '' & sort != undefined) {sorted = '"sort":[{"property":"display","direction":"ASC"}]' };
        if (column != '' & column != undefined) { filter = '"filter":[{"property":"' + column + '","value":"' + guid + '"}]' };
        //if (column != '' & column != undefined) { filter = '"search":{"with":{"' + column + '":{"equal_to":"' + guid + '"}}}' };

        if (filter != '' & sorted != '') { param = ',' }
        $('#waiting').show();
        var request = '{"action":"' + target + '","method":"read","data":[{' + filter + param + sorted + '}],"type":"rpc","tid":1}';

        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.onreadystatechange = handleModelData;
        invocation.send(request);
    }
    else {
        showMsg('No Invocation TookPlace At All.');
    }

    function handleModelData(evtXHR) {
        if (invocation.readyState == 4) {
            if (invocation.status == 200) {
                var json = $.parseJSON(invocation.responseText)
                var color_size_ok = true;
                $.each(json.result.records, function (i, item) {
                    switch (findItemState) {
                        case 0: //categories
                            categories[i] = new Array();
                            break;
                        case 1: //products
                            products[i] = new Array();
                            break;
                        case 2: //styles
                            styles[i] = new Array();
                            break;
                        case 3: //colors
                            colors[i] = new Array();
                            break;
                        case 4: //sizes
                            sizes[i] = new Array();
                            break;
                        case 5: //skus
                            skus[i] = new Array();
                    }
                    $.each(item, function (k, v) {
                        switch (findItemState) {
                            case 0: //categories
                                if (k == 'category_id') categories[i][0] = v;
                                if (k == 'display') categories[i][1] = v;
                                break;
                            case 1: //products
                                if (k == 'product_id') products[i][0] = v;
                                if (k == 'display') products[i][1] = v;
                                break;
                            case 2: //styles
                                if (k == 'style_id') styles[i][0] = v;
                                if (k == 'display') styles[i][1] = v;
                                break;
                            case 3: //colors
                                if (k == 'style_colors_id') colors[i][0] = v;
                                color_size_ok = getColorSize(i, 'Color', 'color_id', v);
                                break;
                            case 4: //sizes
                                if (k == 'style_color_sizes_id') sizes[i][0] = v;
                                color_size_ok = getColorSize(i, 'Size', 'size_id', v);
                                break;
                            case 5: //skus
                                if (k == 'style_color_sizes_id') skus[i][0] = v;
                                if (k == 'display') skus[i][1] = v;
                        }
                    })
                })
                if (color_size_ok == true) {
                    switch (findItemState) {
                        case 0: //categories
                            buttonData = categories;
                            $('#findItemMessage').text('Categories');
                            break;
                        case 1: //products
                            buttonData = products;
                            $('#findItemMessage').text('Products');
                            break;
                        case 2: //styles
                            $('#findItemMessage').text('Styles');
                            buttonData = styles;
                            break;
                        case 3: //colors
                            $('#findItemMessage').text('Colors');
                            buttonData = colors;
                            break;
                        case 4: //sizes
                            $('#findItemMessage').text('Sizes');
                            buttonData = sizes;
                            break;
                        case 5: //skus
                            $('#findItemMessage').text("SKU's");
                            buttonData = skus;
                    }
                    currentButtonData = buttonData;
                    currentButtonPage = 1;
                    displayButtons(buttonData)
                    findItemState += 1;
                }
            } else if (invocation.status == 500) {
                showMsg('Internal Server Error.');
            } else if (invocation.status == 503) {
                showMsg('Sevice Unavailable.');
            } else {
                showMsg('Invocation Errors Occured; Status: ' + invocation.status);
            }
        }
        $('#waiting').hide();
    };
};

function getModelData(target, page, column, guid, school, gender, grade, sort) {
    var invocation = new XMLHttpRequest();
    if (invocation) {
        var filter = '';
        var sorted = '';
        var param = '';

        if (sort != '' & sort != undefined) { sorted = '"sort":[{"property":"display","direction":"ASC"}]' };
        if (column != '' & column != undefined) { filter = '"filter":[{"property":"' + column + '","value":"' + guid + '"}]' };
        //if (column != '' & column != undefined) { filter = '"search":{"with":{"' + column + '":{"equal_to":"' + guid + '"}}}' };

        if (filter != '' & sorted != '') { param = ',' }
        $('#waiting').show();
        var request = '{"action":"' + target + '","method":"read","data":[{' + filter + param + sorted + '}],"type":"rpc","tid":1}';

        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.setRequestHeader("Content-Type", "application/json");
        invocation.onreadystatechange = handleModelData;
        invocation.send(request);
    }
    else {
        $('#waiting').hide();
        showMsg('No Invocation TookPlace At All.');
    }

    function handleModelData(evtXHR) {
        $('#waiting').hide();
        if (invocation.readyState == 4) {
            if (invocation.status == 200) {
                var json = $.parseJSON(invocation.responseText)
                return json;
                }
            } else if (invocation.status == 500) {
                showMsg('Internal Server Error.');
            } else if (invocation.status == 503) {
                showMsg('Sevice Unavailable.');
            } else {
                showMsg('Invocation Errors Occured; Status: ' + invocation.status);
            }
        }
};

function getColorSize(arrayRow, model, column, guid) {
    var invocation = new XMLHttpRequest();
    if (invocation) {
        var filter = '';
        var sorted = '';
        sorted = ',"sort":[{"property":"display","direction":"ASC"}]';
        if (column != '' & column != undefined) { filter = '"filter":[{"property":"' + column + '","value":"' + guid + '"}]' };

        $('#waiting').show();
        var request = '{"action":"' + model + '","method":"read","data":[{' + filter  + sorted + '}],"type":"rpc","tid":1}';
        invocation.open('POST', modelUrl, true);
        invocation.setRequestHeader("X-API-TOKEN", token);
        invocation.onreadystatechange = handleColorSize;
        invocation.send(request);

        function handleColorSize(evtXHR) {
            if (invocation.readyState == 4) {
                if (invocation.status == 200) {
                    var json = $.parseJSON(invocation.responseText)
                    $.each(json.result.records, function (i, item) {
                        $.each(item, function (k, v) {
                            switch (findItemState) {
                                case 3: //colors
                                    if (k == 'display') colors[arrayRow][1] = v;
                                    break;
                                case 4: //sizes
                                    if (k == 'display') sizes[arrayRow][1] = v;
                            }
                        })
                    })
                    return true;
                } else if (invocation.status == 500) {
                    showMsg('Internal Server Error.');
                    return false;
                } else if (invocation.status == 503) {
                    showMsg('Sevice Unavailable.');
                    return false;
                } else {
                    showMsg('Invocation Errors Occured; Status: ' + invocation.status);
                    return false;
                }
            }
        };
    }
    else {
        showMsg('No Invocation TookPlace At All.');
        return false;
    }
};

function displayButtons(buttonData) {
    clearFindButtons();
    if (buttonData.length > (currentButtonPage * 42)) {
        for (i = (currentButtonPage - 1) * 42; i < (currentButtonPage * 42); i++) {
            $('#b' + i)[0].innerHTML = buttonData[i][1];
            $('#b' + i).show();
        }
        //more than screen
        $('#btnMore').show();
        currentButtonPage += 1;
    } else {
        for (i = (currentButtonPage - 1) * 42; i < buttonData.length; i++) {
            $('#b' + i)[0].innerHTML = buttonData[i][1];
            $('#b' + i).show();
        }
        $('#btnMore').hide();
    }
    $('#selectItem').show();
};

// Get SKU information from barcode
function getSkuInformation(barcode) {
    if (barcode !="") {
        //            request = "http://www.horizon.org/skuLookupCodeLookupJSON?&callback=?"
        //            $.getJSON(request, function(response) {
        //                skuLookupCode: barcode
        //            },
        //            function (response) {
        //                if (!city.val() && response && response.skuLookupCode.length && response.skuLookupCode[0].placeName) {
        var qty = 1
        var prc = Math.round(Math.random() * 1000) / 100;
        if (!($('#btnReturn').css('background-color') == 'silver' || $('#btnReturn').css('background-color') == '#c0c0c0' || $('#btnReturn').css('background-color') == 'rgb(192, 192, 192)')) {
            qty = -1 * qty;
        }
        if (data.length > 0) {
            var id = data[data.length - 1]["id"]
            id += 1;
        } else { id = 0 }
        var d = (data[data.length] = {});
        var a = [];
        d["id"] = id;
        d["skuid"] = Math.round(Math.random() * 100000);
        d["barcode"] = barcode;
        if (barcode.toUpperCase() == 'MONOGRAM') {
            qty = 1;
            prc = 5;
            d["description"] = "Monogram";
        } else {
            d["description"] = "Shirt, LS, Pique";
        }
        d["quantity"] = qty;
        d["price"] = prc.formatMoney(2, "");
        d["extended"] = (qty * prc).formatMoney(2, "");
        d["taxable"] = true;
        d["ship"] = phoneOrderShip;
        d["pickup"] = phoneOrderPickup;

        a['AlterLength'] = false;
        a['AlterWaist'] = false;
        a['AlterBoth'] = false;
        a['Special'] = false;
        a['Personalization'] = "";
        a['Neck'] = "";
        a['Chest'] = "";
        a['Sleeve'] = "";
        a['Crotch'] = "";
        a['Waist'] = "";
        a['Inseam'] = "";
        a['BackWaist'] = "";
        a['FinishedLength'] = "";
        a['Bust'] = "";
        a['UnderBust'] = "";
        a['Hip'] = "";
        a['Head'] = "";
        a['Height'] = "";
        a['Weight'] = "";
        a['Notes'] = "";

        d["altspecial"] = a;
        d["school"] = CurrentSchool;
        d["schoolID"] = CurrentSchoolId;
        d["gender"] = $('#male').prop('checked') ? 'MALE' : 'FEMALE';
        d["grade"] = $('#gradesComboBox').val();
        d["originalID"] = d["skuid"];
        d["original_price"] = d["price"];
        d["permanent_price"] = d["price"];
        d["isTaxable"] = true;
        d["isDiscountable"] = true;
        d["return_reason_code"] = "";
        //                }
        //            })

        sumExtendedPrice();
    };
};

function processPhone(international, e) {
    if (e.which == 13 || e.which == 9 || e.which == 33 || e.which == 34  || e.which == 38 || e.which == 40) {
        return 9;
    }
    //adjust for keypad
    if (e.which >= 96 && e.which <= 105) {
        e.which -= 48;
    }

    var ascChar = String.fromCharCode(e.which);
    PhoneLimit = 17;

    $("#" + e.target.id).focus();
    var work = e.target.value;
    var targetValue = '';
    var cursorLocation = getCaretPosition(e.target);
    var originalCursorLocation = cursorLocation;
    var selected = $("#" + e.target.id).getSelection();
    var selectionStart = selected.start;
    var selectionEnd = selected.end;
    var oLength = e.target.value.length;

    //first, clear out the selected text.
    e.target.value = "";
    //get rid of all non-numerics except international dashes
    var deltaCursor = 0;
    var deltaStart = 0;
    var deltaEnd = 0;

    for (var i = 0; i < work.length; i++) {
        // if it is a number or an international dash, add it
        //alert(work.substr(i, 1));
        if (isNaN(work.substr(i, 1)) == false || (international == true && work.substr(i, 1) == "-")) {
            //number or dash - add it
            targetValue += work.substr(i,1);
        } else {
            //non-numeric - ignore it and back up the cursor
            if (cursorLocation > i) {
                deltaCursor += 1;
            }
            if (selectionStart > i) {
                deltaStart += 1;
            }
            if (selectionEnd > i) {
                deltaEnd += 1;
            }
        }
    }
    cursorLocation -= deltaCursor;
    selectionStart -= deltaStart;
    selectionEnd -= deltaEnd;

    var selectionLength = selectionEnd - selectionStart;

    //make sure we don't have an error
    if (cursorLocation > targetValue.length) { cursorLocation = targetValue.length };

    //process non-numeric control codes
    if (e.which < 48 || e.which > 57) {
        //not a number
        if (e.which == 27) {
                // ESC - clear the line
            targetValue = "";
        } else if (e.which == 36) {
                //home
            cursorLocation = 0;
        } else if (e.which == 35) {
                //end
            cursorLocation = oLength;
        } else if (e.which == 37) {
                // left arrow
            if (cursorLocation >= 0) cursorLocation -= 1;
        } else if (e.which == 39) {
            // right arrow
            if (cursorLocation < oLength) cursorLocation += 1;
        } else if (e.which == 8) {
                //backspace
            if (selectionLength == 0) {
                //nothing selected
                if (targetValue.length == 1) {
                    //only one char long
                    targetValue = "";
                    cursorLocation = 0;
                } else if (targetValue.length == cursorLocation) {
                    //at end of line
                    targetValue = targetValue.substr(0, targetValue.length - 1);
                    cursorLocation -= 1;
                } else {
                     //middle of the line
                    targetValue = targetValue.substr(0, cursorLocation-1) + targetValue.substr(cursorLocation);
                    cursorLocation -= 1;
                }
            } else {
                //something selected
                if (selectionLength == targetValue.length) {
                    //everything selected
                    targetValue = "";
                    cursorLocation = 0;
                } else if (selectionEnd == targetValue.length) {
                    targetValue = targetValue.substr(0, selectionStart);
                    cursorLocation = selectionStart;
                } else {
                    targetValue = targetValue.substr(0, selectionStart) + targetValue.substr(selectionEnd);
                    cursorLocation = selectionStart;
                }
            }

            //delete
        } else if (e.which == 46) {
                //delete - only remove the previous character is there is no highlighted text
            if (selectionLength == 0) {
                //nothing selected
                if (targetValue.length == 1 && cursorLocation == 0) {
                    //at the beginning of a single character line
                    targetValue = "";
                } else if (targetValue.length > 1 && cursorLocation < targetValue.length) {
                        //not at the end of the line
                    targetValue = targetValue.substr(0, cursorLocation) + targetValue.substr(cursorLocation+1);
                }
                    } else {
                //something selected
                if (selectionLength == targetValue.length) {
                    //everything selected
                    targetValue = "";
                    cursorLocation = 0;
                } else if (selectionEnd == targetValue.length) {
                    targetValue = targetValue.substr(0, selectionStart);
                    cursorLocation = selectionStart;
                } else {
                    targetValue = targetValue.substr(0, selectionStart-1) + targetValue.substr(selectionEnd);
                    cursorLocation = selectionStart;
                }
            }

                //dash
        } else if (e.which == 173) {
                //dash
            if (international == true && targetValue.length > 0 && oLength < PhoneLimit) {
                if (selectionLength == 0) {
                    //nothing selected
                    if (cursorLocation == 0) {
                    } else if (cursorLocation == targetValue.length) {
                        if (targetValue.substr(cursorLocation-1,1) != "-") {
                            //international; cursor is at the end - just add the dash
                            targetValue += "-";
                            cursorLocation += 1;
                        }
                    } else {
                        //cursor is in the middle somewhere
                        if (targetValue.substr(cursorLocation - 1, 1) != "-" && (cursorLocation != targetValue.length && targetValue.substr(cursorLocation, 1) != "-")) {
                            targetValue = targetValue.substr(0, cursorLocation) + "-" + targetValue.substr(cursorLocation);
                            cursorLocation += 1;
                        }
                    }
                } else {
                    //something selected
                    if (selectionLength == targetValue.length) {
                        //everything selected
                        targetValue = "";
                        cursorLocation = 0;
                    } else if (cursorLocation == 0) {
                        targetValue = "";
                        cursorLocation = 0;
                    } else if (selectionEnd == targetValue.length) {
                            //at the end
                        if (targetValue.substr(selectionStart - 1, 1) != "-") {
                            targetValue = targetValue.substr(0, selectionStart) + "-";
                            cursorLocation = selectionStart + 1;
                        }
                    } else {
                        //in the middle
                        if (targetValue.substr(selectionStart - 1, 1) != "-" && (cursorLocation != targetValue.length && targetValue.substr(selectionEnd, 1) != "-")) {
                            targetValue = targetValue.substr(0, selectionStart) + "-" + targetValue.substr(selectionEnd);
                            cursorLocation = selectionStart + 1;
                        }
                    }
                }
                }
            }
        if (targetValue == "") { international = false; }
    } else {
        //process a number
        if (targetValue.length > 0 || (targetValue.length == 0 && ascChar != "1")) {
            if (selectionLength == 0) {
                if (targetValue.length < PhoneLimit) {
                    if (cursorLocation == targetValue.length) {
                        //cursor is at the end - just add it
                        targetValue += ascChar;
                        cursorLocation += 1;
                    } else if (cursorLocation == 0) {
                            //cursor is at the beginning
                        if (ascChar != "1" && ascChar != "0") {
                            targetValue = ascChar + targetValue;
                            cursorLocation += 1;
                        }
                    } else {
                        //cursor is in the middle somewhere
                        targetValue = targetValue.substr(0, cursorLocation) + ascChar + targetValue.substr(cursorLocation);
                        cursorLocation += 1;
                    }
                }

            } else {
                //something selected
                if (selectionLength == targetValue.length) {
                    //everything selected
                    targetValue = ascChar;
                    cursorLocation = 1;
                } else if (selectionEnd == targetValue.length) {
                    //cursor is at the end - just add it
                    targetValue = targetValue.substr(0, selectionStart) + ascChar;
                    cursorLocation = selectionStart + 1;
                } else {
                    //in the middle
                    targetValue = targetValue.substr(0, selectionStart) + ascChar + targetValue.substr(selectionEnd);
                    cursorLocation = selectionStart + 1;
                }
            }
        }
    }

    //parse the phone number
    if (targetValue != "" && international == false) {
        work = targetValue;
        targetValue = "";
        for (var i = 0; i < work.length; i++) {
            switch (i) {
                case 2:
                    targetValue += work.substr(i, 1) + "-";
                    if (cursorLocation >= 3) { cursorLocation += 1 };
                    break;
                case 5:
                    targetValue += work.substr(i, 1) + "-";
                    if (cursorLocation >= 7) { cursorLocation += 1 };
                    break;
                case 10:
                    targetValue += "X" + work.substr(i)
                    if (cursorLocation > 11) { cursorLocation += 1 };
                    break;
                default:
                    if (i < 11) {
                        targetValue += work.substr(i, 1);
                    }
            }
        }
    }
    if (targetValue.length > 0 && targetValue.substr(0, 1) == "0") {
        international = true;
    }
    e.target.value = targetValue;
    setCaretPosition(e, cursorLocation);
    if (international) { return 1 } else { return 0 };
};

function parsePhone(international, phone) {
    var targetValue = '';
    var work = phone;

    //get rid of all non-numerics except international dashes

    for (var i = 0; i < work.length; i++) {
        // if it is a number or an international dash, add it
        //alert(work.substr(i, 1));
        if (isNaN(work.substr(i, 1)) == false || (international == true && work.substr(i, 1) == "-")) {
            //number or dash - add it
            targetValue += work.substr(i, 1);
            }
        }

    //parse the phone number
    if (targetValue != "" && international == false) {
        work = targetValue;
        targetValue = "";
        for (var i = 0; i < work.length; i++) {
            switch (i) {
                case 2:
                    targetValue += work.substr(i, 1) + "-";
                    break;
                case 5:
                    targetValue += work.substr(i, 1) + "-";
                    break;
                case 10:
                    targetValue += "X" + work.substr(i)
                    break;
                default:
                    if (i < 11) {
                        targetValue += work.substr(i, 1);
                    }
            }
        }
    }

    return targetValue;
};

function replaceAll(txt, replace, with_this) { return txt.replace(new RegExp(replace, 'g'), with_this); };

function getCaretPosition(ctrl) {
    var CaretPos = 0;	// IE Support
    if (document.selection) {
        //IE
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        //other
        CaretPos = ctrl.selectionStart;
    }
    return (CaretPos);
};

function setCaretPosition(e, caretPos) {
    var elem = document.getElementById(e.target.id);

    if (elem != null) {
        if (elem.createTextRange) {
            //IE
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            //other
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
};

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

function eraseCookie(name) {
    createCookie(name, "", -1);
};

