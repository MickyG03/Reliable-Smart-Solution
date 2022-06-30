var id = 0;
var devicesid = 0;
var fileName;
var filePath;
var dropdown;
var FileList = [];
var categorylist = [];

var excelframes = {};
var categoryframe = [];

var clientdetails = [];


$(document).ready(function() {



    function getfilepath(evt) {

        filePath = $(this).val();
        fileName = filePath.split(/(\\|\/)/g).pop();

        filePath = "excels/" + fileName;
        var files = evt.target.files; // FileList object
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(files[0]);
    }

    document.getElementById('myfile').addEventListener('change', getfilepath, false);
    // $('#myfile').on('change', function() {

    // });

    $("#upload").click(function() {

        filePath = "excels/" + fileName;


    });




});





var createroom = function() {
    event.preventDefault();




    var roomform = `<br><div class="container">
        <div id="Room` + id + `" class="card text-center">
            <div class="card-header">
                Room ` + id + ` 
            </div>
            <div class="card-body">
                <button onclick="createdevice(this);" type="button" class="btn btn-outline-primary">Add Device </button>
            </div>
        </div>
    </div>`;
    $('#productform').before(roomform);

    id += 1;

}

function createCategoryDropdown() {

    var startdropdown = `
        <div class="card text-center" id="deviceId` + devicesid + `">
            <div class="card-body">
                <div class="row">
        `;
    var startcolumn = '<div class="col-4">';
    var endcolumn = '</div>';
    var enddropdown = `</div>
    </div>
    </div><br>`;

    var dropdown1 = `<select class="selectpicker btn-secondary" data-style="btn-secondary" name="dropdownMenuButton1" id="dropdownMenuButton1" onchange="changedropdown(this.parentElement.nextElementSibling.firstChild,this.value);">
                        <option value="Select">Select</option>
     `;



    var dropdown2 = "";
    for (var all in categorylist) {
        dropdown2 = dropdown2 + '<option value="' + categorylist[all] + '">' + categorylist[all] + '</option>'
    }


    var dropdown3 = `</select>`;

    dropdown = dropdown1 + dropdown2 + dropdown3;


    var secondDropdown1 = `<select class="selectpicker btn-secondary" data-style="btn-secondary" name="dropdownMenuButton2" id="dropdownMenuButton2" disabled onchange="changevalues(this.parentElement.previousSibling.firstChild,this.value)">
    <option value="Select" >Select</option>
`;

    var secondDropdown2 = "";

    for (var all in excelframes) {
        for (var all2 in excelframes[all]) {
            secondDropdown2 = secondDropdown2 + '<option class="' + all + '" value = "' + excelframes[all][all2]["productname"] + '" >' + excelframes[all][all2]["productname"] + '</option>';
        }
    }

    // for (var all in exceldata) {
    //     // console.log(exceldata[all]);
    //     for (var all2 in exceldata[all]) {
    //         for (var key in exceldata[all][all2]) {
    //             if (key.includes("cate")) {
    //                 secondDropdown2 = secondDropdown2 + '<option class="' + key + '" value = "' + exceldata[all][all2][key] + '" >' + exceldata[all][all2][key] + '</option>';
    //             }
    //         }
    //     }
    // }

    var secondDropdown3 = `</select>`

    secondDropdown = secondDropdown1 + secondDropdown2 + secondDropdown3;

    secondDropdown = secondDropdown + '<br><br><figure class="text-center"><p><small><small></p></figure>'

    var inputbox = `<input type="number" class="form-control" placeholder="Quantity" id="dropdownMenuButton3" aria-label="First name">`;

    finaldropdown = startdropdown + startcolumn + dropdown + endcolumn + startcolumn + secondDropdown + endcolumn + startcolumn + inputbox + endcolumn + enddropdown;
    //console.log(dropdown);

    devicesid += 1;

}

function changevalues(cate, prod) {
    var quant = 0;
    var price = 0;

    if (cate.value == "select" || prod == "select") {
        document.getElementsByTagName('small')[0].innerHTML = "none";
    } else {

        quant = quantityperunit(cate.value, prod);
        price = priceperunit(cate.value, prod);
        document.getElementsByTagName('small')[0].innerHTML = "<strong> Price : </strong>" + price + "&nbsp;&nbsp;&nbsp;<strong>Stock : </strong>" + quant;
    }


}

function changedropdown(drop, value) {

    var className = value;
    //console.log(value)

    drop.value = "Select";
    // console.log($(drop));
    // console.log($(drop).find('option.' + className));

    $(drop).find('option').hide();
    $(drop).find('option.' + className).show();
    $(drop).prop('disabled', false);
    console.log(document.getElementsByTagName('small')[0].innerText = "");
}

function createdevice(currentDiv) {


    $(currentDiv).before(finaldropdown);



}



var startroom = function() {
    event.preventDefault();

    firstName = document.getElementById("firstname").value;
    lastName = document.getElementById("lastname").value;
    contactNumber = document.getElementById("contact").value;
    emailId = document.getElementById("inputEmail").value;
    clientdetails.push(firstName);
    clientdetails.push(lastName);
    clientdetails.push(contactNumber);
    clientdetails.push(emailId);

    window.localStorage.setItem('clientdetails', JSON.stringify(clientdetails));
    // console.log(firstName + lastName + contactNumber + emailId);

    window.location.href = "createsite.html";
}

var startsite = function() {

    //exceldata = JSON.parse(window.localStorage.getItem('exceldata'));
    excelframes = JSON.parse(window.localStorage.getItem('exceldataframes'));
    clientdetails = JSON.parse(window.localStorage.getItem('clientdetails'));
    console.log(clientdetails);

    for (var i in excelframes) {


        categorylist.push(i);

    }
    createCategoryDropdown();
}

function convertexceldata(dataJson) {

    var category;

    categoryframe = [];
    for (var key in dataJson[0]) {
        category = key;
        break;
    }

    for (all in dataJson) {
        var tempframe = {
            "productname": dataJson[all][category],
            "productprice": dataJson[all]["price"],
            "productunit": dataJson[all]["unit"]
        }
        categoryframe.push(tempframe);
    }
    excelframes[category] = categoryframe;


}

var ExcelToJSON = function() {

    this.parseExcel = function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function(sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                convertexceldata(JSON.parse(json_object));
                exceldata.push(JSON.parse(json_object));

            })


            // window.localStorage.setItem('exceldata', JSON.stringify(exceldata));
            window.localStorage.setItem('exceldataframes', JSON.stringify(excelframes));


        };

        reader.onerror = function(ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

var finalsitedetails = [];

var category, product, count, ppu;

function finish() {

    $('*[id*=Room]:visible').each(function() {

        //  console.log(this.id);
        var devicedetails = [];
        $(this).find('*[id*=deviceId]:visible').each(function() {
            $(this).find('*[id*=dropdownMenuButton]:visible').each(function() {
                if (this.id == "dropdownMenuButton1") {
                    category = this.value;
                } else if (this.id == "dropdownMenuButton2") {
                    product = this.value;
                } else if (this.id == "dropdownMenuButton3") {
                    count = this.value;
                }
                ppu = priceperunit(category, product);
            });


            var dataframe = {
                "category": category,
                "product": product,
                "count": count,
                "ppu": ppu,
                "totalPrice": parseInt(ppu) * parseInt(count)
            }
            devicedetails.push(dataframe);
        });

        var roomframe = {
            "Room": this.id,
            "Roomdevices": devicedetails
        }

        finalsitedetails.push(roomframe);

    });

    console.log(finalsitedetails);

    var wb = XLSX.utils.book_new();
    console.log(wb);

    wb.Props = {
        Title: "Reliable Smart solution",
        Subject: "Test",
        Author: "Red Stapler"
    };
    wb.SheetNames.push("Test Sheet");
    var ws_data = [
        clientdetails, ["", ""],
    ];
    var row = [];
    var totalsum = 0;
    for (var all in finalsitedetails) {
        row.push(finalsitedetails[all]["Room"]);
        row.push("Category", "Product", "Price Per Unit", "Count", "Total Price");
        ws_data.push(row);
        row = [];

        for (var all2 in finalsitedetails[all]["Roomdevices"]) {
            totalsum = totalsum + finalsitedetails[all]["Roomdevices"][all2]["totalPrice"];
            row.push(all2, finalsitedetails[all]["Roomdevices"][all2]["category"], finalsitedetails[all]["Roomdevices"][all2]["product"], finalsitedetails[all]["Roomdevices"][all2]["count"], finalsitedetails[all]["Roomdevices"][all2]["ppu"], finalsitedetails[all]["Roomdevices"][all2]["totalPrice"]);
            ws_data.push(row);
            row = [];
        }
        row = ["", ""];
        ws_data.push(row);
        row = [];

    }

    row = ["Total Sum", totalsum];
    ws_data.push(row);


    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Test Sheet"] = ws;

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');

}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

var priceperunit = function(cat, prod) {

    var ppu = 0;
    flag = 0;
    // for (var all in exceldata) {
    //     for (var all2 in exceldata[all]) {
    //         for (var key in exceldata[all][all2]) {
    //             if (key == cat) {
    //                 if (exceldata[all][all2][key] == prod) {
    //                     flag = 1;
    //                     ppu = exceldata[all][all2]["price"];
    //                     break;
    //                 }

    //             }


    //         }
    //         if (flag == 1) {
    //             break;
    //         }
    //     }
    //     if (flag == 1) {
    //         break;
    //     }
    // }
    console.log(excelframes);
    for (all in excelframes[cat]) {
        if (excelframes[cat][all]["productname"] == prod) {
            flag = 1;
            ppu = excelframes[cat][all]["productprice"];
            break;
        }
    }


    return ppu;
}



var quantityperunit = function(cat, prod) {

    var qpu = 0;


    console.log(excelframes);
    for (all in excelframes[cat]) {
        if (excelframes[cat][all]["productname"] == prod) {

            qpu = excelframes[cat][all]["productunit"];
            break;
        }
    }


    return qpu;
}