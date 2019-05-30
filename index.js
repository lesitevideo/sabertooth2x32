var serialport = require('serialport');
var Readline = serialport.parsers.Readline;
var parser = new Readline();

var M1=0,M2=0;
var v1 = 0, v2 = 0;
var pollInterval = 5000; // millisecondes

var STserialPort = new serialport("/dev/ttyACM0", {
	baudRate: 9600,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false
});

STserialPort.pipe(parser);

parser.on('data', function (data) {
    // 249 = 100%
    // 244 = 50%
    // 242 = 20% DANGER
    // 240 = 0% DEAD
    var arr = data.split(":B");
    arr[1].replace('\r','');

    console.log( arr[1]/10 + 'v => ' + mapVoltage( arr[1]/10 ) + '%' );
})

STserialPort.on("open", function () {
	console.log( 'Sabertooth OK +> "/dev/ttyACM0"' );
    STserialPort.write("M1:getb\n\rM2:getb\n\r");
});

function pollVoltage(arg) {
    STserialPort.write("M1:getb\n\rM2:getb\n\r");
}

function mapVoltage( x ){
    return ((x - 24) * (100 - 0) / (24.9 - 24) + 0).toFixed(2) ;
}

setInterval(pollVoltage, pollInterval);