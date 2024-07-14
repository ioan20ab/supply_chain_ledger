const { Contract, Context } = require('fabric-contract-api');
class SupplyChainLedgerContract extends Contract {

    constructor() {
        super('org.scln.SupplyChainLedgerContract');
        }
}

async makeItem(ctx, manufacturer, ItemNumber, ItemName,
ownerName) {

let dt = new Date().toString();
const item = {
    itemNumber,
    manufacturer,
    itemName,
    ownerName,
    previousOwnerType: 'MANUFACTURER',
    currentOwnerType: 'MANUFACTURER',
    createDateTime: dt,
    lastUpdated: dt
    };
await ctx.stub.putState(ItemNumber, Buffer.from(JSON.stringify(item)));
  
}
/////////////////////////////////
async wholesalerDistribute(ctx, ItemNumber, ownerName) {
    
    const equipmentAsBytes = await ctx.stub.getState(equipmentNumber);
    if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
        throw new Error(`${equipmentNumber} does not exist`);
    }

    let dt = new Date().toString();
    const strValue = Buffer.from(equipmentAsBytes).toString('utf8');
    let record;

    try {
        record = JSON.parse(strValue);
        if(record.currentOwnerType!=='MANUFACTURER') {
            throw new Error(` equipment - ${equipmentNumber} owner must be MANUFACTURER`);
        }
        record.previousOwnerType= record.currentOwnerType;
        record.currentOwnerType = 'WHOLESALER';
        record.ownerName = ownerName;
        record.lastUpdated = dt;
} catch (err) {
    throw new Error(`equipment ${equipmentNumber} data can't be
    processed`);
    }
    
    await ctx.stub.putState(equipmentNumber,
Buffer.from(JSON.stringify(record)));
}

async itemReceived(ctx, ItemNumber, ownerName) {
// ItemReceived logic
}