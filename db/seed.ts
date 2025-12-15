import { EntityApprovalStatuses, Groups, OwnerShipTypes, PaymentModes, PaymentStatuses, Projects, Roles, Services } from './schema';
import { count } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
export const db = drizzle(new Pool({connectionString: process.env.POSTGRES_URL!}));

async function seed() {
    //seed roles
    try {
        let result =await db.select({ count: count(Roles.role) }).from(Roles)
        if(result[0].count) {
            return;
        }
        await db.insert(Roles).values([{
            role: 'ADMIN'
        }, {
            role: 'USER'
        }, {
            role: 'SUPER_ADMIN'
        }]).onConflictDoNothing()
    } catch (e) {
        console.log(e)
    }
    //seed Ownership Types
    try {
        let result =await db.select({ count: count(OwnerShipTypes.ownershipType) }).from(OwnerShipTypes)
        if(result[0].count) {
            return;
        }
        await db.insert(OwnerShipTypes).values([{
            ownershipType: 'Tenant'
        }, {
            ownershipType: 'Owner'
        }
        ]).onConflictDoNothing()
    } catch (e) {
        console.log(e)
    }
    //seed payment modes
    try {
        let result =await db.select({ count: count(PaymentModes.paymentMode) }).from(PaymentModes)
        if(result[0].count) {
            return;
        }
        await db.insert(PaymentModes).values([{
            paymentMode: 'Wallet'
        }, {
            paymentMode: 'Offline'
        }, {
            paymentMode: 'Payment Gateway'
        }]).onConflictDoNothing()
    } catch (e) {
        console.log(e)
    }

    try {
        let result =await db.select({ count: count(EntityApprovalStatuses.status) }).from(EntityApprovalStatuses)
        if(result[0].count) {
            return;
        }
        // seed Approval Statuses
        await db.insert(EntityApprovalStatuses).values([{
            status: "Approved"
        }, {
            status: 'Pending'
        },
        ]).onConflictDoNothing()

    } catch (e) {
        console.log(e)
    }

    try {

        let result =await db.select({ count: count(PaymentStatuses.status) }).from(PaymentStatuses)
        if(result[0].count) {
            return;
        }
        // seed Approval Statuses
        await db.insert(PaymentStatuses).values([{
            status: "Paid"
        }, {
            status: 'In Progress'
        },
        {
            status: 'Failed'
        }
        ]).onConflictDoNothing()

    } catch (e) {
        console.log(e)
    }

    try {
        let result =await db.select({ count: count(Services.service) }).from(Services)
        if(result[0].count) {
            return;
        }
        // seed Services
        await db.insert(Services).values([
            {
                category: 'Utilities',
                service: 'Electricity',
                subService: 'EB',
                unitCost: "8.9"
            },
            {
                category: 'Utilities',
                service: 'Electricity',
                subService: 'DG',
                unitCost: "7"
            },
            {
                category: 'Utilities',
                service: 'Electricity',
                subService: 'Solar',
                unitCost: "3"
            },
            {
                category: 'Utilities',
                service: 'Water',
                subService: 'MBR',
                unitCost: '0.1',
            },
            {
                category: 'Utilities',
                service: 'Water',
                subService: 'CBR',
                unitCost: '1.5',
            },
            {
                category: 'Utilities',
                service: 'Water',
                subService: 'GBR',
                unitCost: '100',
            },
            {
                category: 'Utilities',
                service: 'Water',
                subService: 'KIT',
                unitCost: '8',
            },
            {
                category: 'Utilities',
                service: 'Gas',
                subService: 'Domestic',
                unitCost: '10'
            },
            {
                category: 'Others',
                service: 'Maintainance',
                subService: 'Domestic',
                unitCost: '10'
            },
        ]).onConflictDoNothing()

    } catch (e) {
        console.log(e)
    }

    let projectId = '';
    let groupId = ''
    try {
        let result =await db.select({ count: count(Projects.name) }).from(Projects)
        if(result[0].count) {
            return;
        }
        let projects = await db.insert(Projects).values({
            name: "Risinia Skyon"
        }).onConflictDoNothing().returning();
        projectId = projects[0].id;
    } catch (e) {
        console.log(e)
    }

    try {
        let result =await db.select({ count: count(Groups.name) }).from(Groups)
        if(result[0].count) {
            return;
        }
        let groups = await db.insert(Groups).values([{
            name: "A Block",
            projectId
        }]).onConflictDoNothing().returning()
        groupId = groups[0].id
    } catch (e) {
        console.log(e)
    }

}

seed()
