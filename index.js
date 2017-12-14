const pos = require('node-custom-pos');
const device = new pos.USB();
const printer = new pos.Printer(device);

const Gpio = require('onoff').Gpio;

const EntryLoop = new Gpio(1, 'in', 'both');
const TicketButton = new Gpio(2, 'in', 'rising');
const ButtonLED = new Gpio(3, 'out');
const ExitLoop = new Gpio(4, 'in', 'both');

const utils = require('./utils');

let entryActive = false;
let exitLoopActive = false;

console.log('Ticket Printer Module Acitve. Waiting for inputs....');


EntryLoop.watch((err, value) => {
    console.log('Entry loop value', value);

    if ( err )
        throw new Error(err);
    if ( value === 1 ) {
        entryActive = true;
        enableButtonLED(value)
    } else if ( value === 0 ) {
        entryActive = false;
    }
});

TicketButton.watch((err, value) => {
    console.log('Button Pressed');

    printTicket();
});

ExitLoop.watch((err, value) => {
    console.log('Exit loop value', value);
    if ( err )
        throw new Error(err);
    if ( value === 1 ) {
        exitLoopActive = true;
        console.log('SENDING TO DB!!');

        // TODO Send to DB
    }
});

function enableButtonLED(value) {
    ButtonLED.writeSync(value)
}

function printTicket() {
    device.open((err) => {
        printer
            .model('custompos')
            .hardware('INIT')
            .font('A')
            .align('CT')
            .style('BU')
            .size(2, 2)
            .print('RoninTech Parking')
            .feed()
            .style('NORMAL')
            .size(1, 1)
            .barcode(utils.constructBarcode(), 'EAN13')
            .feed()
            .feed()
            .print(utils.getDate())
            .feed()
            .print(utils.getTime())
            .feed()
            .feed()
            .print('1 Hours AED 10')
            .feed()
            .print('First 15 Minutes Free')
            .feed()
            .print('Lost Ticket Charge AED 150')
            .feed()
            .style('I')
            .print('Thank You')
            .cut()
            .close();
    });
}

process.on('SIGINT', function () {
    EntryLoop.unexport();
    ExitLoop.unexport();
    TicketButton.unexport();
    ButtonLED.unexport();
});