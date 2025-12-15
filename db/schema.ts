
import {
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
    varchar,
    integer,
    bigint,
    decimal,
    boolean,
    primaryKey,
    unique,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';



function track() {
    return {
        updatedAt: timestamp('updated_at', { mode: 'date', precision: 3, withTimezone: true }).$onUpdate(() => new Date()),
        createdAt: timestamp('created_At', { mode: 'date', precision: 3, withTimezone: true }).$defaultFn(() => new Date()),
    }

}
export const Roles = pgTable(
    'roles',
    {
        id: serial('id').primaryKey(),
        role: text('role').unique().notNull(),
        ...track()
    }
);

export const RolesRelations = relations(Roles, ({ many }) => ({
    users: many(Users),
}));


export const Users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull().unique(),
        mobile: varchar('mobile', { length: 16 }).notNull().unique(),
        avatar: text('avatar'),
        roleId: integer('role_id').notNull().references(() => Roles.id),
        email_verified: boolean('email_verified').default(false),
        mobile_verified: boolean('mobile_verified').default(false),
        ...track()
    }
);

export const OTP = pgTable(
    'otp',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        otp: integer('otp').notNull(),
        sentEmailreferenceId:  text('sent_email_reference_id').notNull(),
        email: text('email').notNull(),
        mobile: varchar('mobile', { length: 16 }).notNull(),
        validTill: timestamp('valid_till', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
        ...track()
    }
)
export const userRelations = relations(Users, ({ one, many }) => ({
    UserEntities: many(UserEntitites),
    roles: one(Roles, {
        references: [Roles.id],
        fields: [Users.roleId]
    }),
    projectAdmins: many(projectAdmins),
    bills: many(EntityBills)
}));

export const Projects = pgTable(
    'projects',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: text('name').notNull(),
        // bill_generation_date: integer('bill_generation_date'),
        address1: text('address1'),
        address2: text('address2'),
        Address3: text('address3'),
        city: text('city'),
        State: text('state'),
        country: text('country'),
        postalCode: text('postal_code'),
        projectCode: text('project_code'),
        // due_date: integer('due_date'),
        accountName: text('account_name'),
        accountNumber: text('account_number'),
        ifscCode: text('ifsc_code'),
        branch: text('branch'),
        bank: text('bank'),
        ...track()
    }
)

export const ProjectRelations = relations(Projects, ({ many }) => ({
    Groups: many(Groups),
    admins: many(projectAdmins)
}))

export const Groups = pgTable(
    'groups', //project blocks
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: text('name').notNull(),
        projectId: uuid('project_id').notNull().references(() => Projects.id),
        ...track()
    }
)

export const GroupsRelations = relations(Groups, ({ one, many }) => ({
    project: one(Projects, {
        references: [Projects.id],
        fields: [Groups.projectId]
    }),
    Entities: many(Entities)
}))

export const Entities = pgTable(
    'entities', //apartments
    {
        id: uuid('id').defaultRandom().primaryKey(),
        entity: text('entity').notNull(),
        groupId: uuid('group_id').notNull().references(() => Groups.id),
        ...track()
    }
)

export const EntityRelations = relations(Entities, ({ one, many }) => ({
    groups: one(Groups, {
        references: [Groups.id],
        fields: [Entities.groupId]
    }),
    services: many(EntityServices)
}))

export const EntityApprovalStatuses = pgTable(
    'entity_approval_statuses', {
    id: serial('id').primaryKey(),
    status: text('status').notNull()
}
)

export const EntityApprovalStatusesRelations = relations(EntityApprovalStatuses, ({ one, many }) => {
    return {
        entities: many(UserEntitites)
    }
})

export const OwnerShipTypes = pgTable('ownership_types', {
    id: serial('id').primaryKey(),
    ownershipType: text('ownership_type').notNull().unique()
})


export const OwnerShipTypesRelations = relations(OwnerShipTypes, ({ one, many }) => {
    return {
        entities: many(UserEntitites)
    }
})

export const projectAdmins = pgTable('project_admins', {
    id: uuid('id' ).defaultRandom().primaryKey(),
    projectId: uuid('project_id').notNull().references(() => Projects.id),
    userId: uuid('user_id').notNull().references(() => Users.id),
    ...track()
})

export const projectAdminsRelations = relations(projectAdmins, ({ one, many }) => {
    return {
        project:  one(Projects, {
            references: [Projects.id],
            fields: [projectAdmins.projectId]
        }),
        user:  one(Users, {
            references: [Users.id],
            fields: [projectAdmins.userId]
        }),
    }
})

export const UserEntitites = pgTable(
    'user_entities',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id').notNull().references(() => Users.id),
        entityId: uuid('entity_id').notNull().references(() => Entities.id),
        statusId: integer('status_id').notNull().references(() => EntityApprovalStatuses.id),
        ownerShipTypeId: integer('owner_ship_type').notNull().references(() => OwnerShipTypes.id),
        primary: boolean('primary').notNull().default(false),
        ...track()
    }, (t) => {
        return {
            unq: unique().on(t.userId, t.entityId),
        }
    }
);


export const userEntityRelations = relations(UserEntitites, ({ one, many }) => ({
    entity: one(Entities, {
        references: [Entities.id],
        fields: [UserEntitites.entityId]
    }),
    user: one(Users, {
        references: [Users.id],
        fields: [UserEntitites.userId]
    }),
    status: one(EntityApprovalStatuses, {
        references: [EntityApprovalStatuses.id],
        fields: [UserEntitites.statusId]
    }),
    OwnerShipType: one(OwnerShipTypes, {
        references: [OwnerShipTypes.id],
        fields: [UserEntitites.ownerShipTypeId]
    })
}))
export const paymentTypeEnum = pgEnum("paymentTypes", ["Prepaid", "Postpaid"]);

export const Services = pgTable(
    'services', {
    id: serial('id').primaryKey(),
    service: text('service').notNull(), // electricity
    subService: text('sub_service').notNull(), //DG(distribution generated), //solar, //EB (electricity board)
    unitCost: decimal('unit_cost').notNull(),
    limit: text('limit'),
    category: text('category').notNull(),
    projectId: uuid('project_id').references(() => Projects.id),
    bill_generation_date: integer('bill_generation_date'),
    due_date: integer('due_date'),
    unit: text('unit'),
    color: text('color'),
    paymentType: paymentTypeEnum('paymentType').default("Postpaid"),
    active: boolean('active').default(true),
    ...track()
})

export const ServicesRelations = relations(Services, ({ many }) => ({
    entityServices: many(EntityServices)
}))

export const EntityServices = pgTable(
    'entity_services', {
    id: uuid('id').defaultRandom().primaryKey(),
    serviceId: integer('service_id').notNull().references(() => Services.id),
    entityId: uuid('entity_id').references(() => Entities.id),
    parameter_name: text('parameter_name').notNull(), //ED1, ed2,ed3
    sid: text('sid').notNull(),
    deviceId: integer('device_id').notNull().references(() => devices.id),
    ...track()
}
)

export const entityServiceRelations = relations(EntityServices, ({ one, many }) => {
    return {
        service: one(Services, {
            references: [Services.id],
            fields: [EntityServices.serviceId]
        }),
        device: one(devices, {
            references: [devices.id],
            fields: [EntityServices.deviceId]
        }),
        entity: one(Entities, {
            references: [Entities.id],
            fields: [EntityServices.entityId]
        }),
        bills: many(EntityBills)
    }
})

export const EntityConsumption = pgTable(
    'entity_consumption', {
    id: uuid('id').defaultRandom().notNull(),
    entityServiceId: uuid('entity_service_id').notNull().references(() => EntityServices.id), // electricity or water or any other,
    units_consumed: decimal('units_consumed').notNull(), //energy consumed
    date: timestamp('date', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    ...track(),
    createdAt: timestamp('created_At', { mode: 'date', precision: 3, withTimezone: true }).$defaultFn(() => new Date()).notNull(),

}, (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] })
    };
  }
)

export const entityConsumptionRelations = relations(EntityConsumption, ({ one, many }) => {
    return {
        entityService: one(EntityServices, {
            references: [EntityServices.id],
            fields: [EntityConsumption.entityServiceId]
        }),
    }
})

export const PaymentStatuses = pgTable(
    'payment_statuses', {
        id: serial('id').primaryKey(),
        status: text('status').notNull().unique()
    }
)

export const PaymentStatusesRelations = relations(PaymentStatuses, ({many}) => ({
    bills: many(EntityBills)
}))

export const PaymentModes = pgTable('payment_modes', {
    id: serial('id').primaryKey(),
    paymentMode: text('payment_mode').notNull()
})

export const PaymentModesRelations = relations(PaymentModes, ({many}) => ({
    bills: many(EntityBills)
}))

export const EntityBills = pgTable(
    'entity_bills', {
    pastReading: decimal('past_reading').notNull().default("0"),
    presentReading: decimal('present_reading').notNull().default("0"),
    serviceId: uuid('service_id').notNull().references(() => EntityServices.id),
    unitsConsumed: decimal('units_consumed').notNull(),
    fromDate: timestamp('from_date', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    toDate: timestamp('to_date', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    bill_mode: text('bill_mode'),
    dueDate: timestamp('due_date', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    generatedOn: timestamp('paid_on', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    paymentStatusId: integer('payment_status_id').notNull().references(() => PaymentStatuses.id), //failed, awaiting response, success
    paidOn: timestamp('paid_on', { mode: 'date', precision: 3, withTimezone: true }).notNull(),
    paidById: uuid('paid_by_id').references(() => Users.id),
    paymentModeId: integer('payment_mode_id').notNull().references(() => PaymentModes.id),//wallet, offline, payment gateway(phone pe),
    paymentId: text('payment_id'), // if paid by wallet (wellet deduction id), if paid by payment gate way (gateway id)
    ...track()
}
)

export const entityBillRelations = relations(EntityBills, ({ one }) => {
    return {
        service: one(EntityServices, {
            references: [EntityServices.id],
            fields: [EntityBills.serviceId]
        }),
        paymentStatus: one(PaymentStatuses, {
            references: [PaymentStatuses.id],
            fields: [EntityBills.paymentStatusId]
        }),
        paymentMode: one(PaymentModes, {
            references: [PaymentModes.id],
            fields: [EntityBills.paymentModeId]
        }),
        paidBy: one(Users, {
            references: [Users.id],
            fields: [EntityBills.paidById]
        })

    }
})

export const bills = pgTable(
    'bills', {
    generated_bill_id: text('generated_bill_id'),
    bill_no: text('bill_no'),
    bill_date: text('bill_date'),
    due_date: text('due_date'),
    project_group_name: text('project_group_name'),
    entity: text('entity'),
    service: text('service'),
    project: text('project'),
    group_name: text('group_name'),
    service_subtype: text('service_subtype'),
    from_date: text('from_date'),
    to_date: text('to_date'),
    past_reading: text('past_reading'),
    present_reading: text('present_reading'),
    consumption: text('consumption'),
    unit_cost: text('unit_cost'),
    amount: text('amount'),
    bill_mode: text('bill_mode'),
    status: text('status'),
    remarks: text('remarks')
}
)

export const devices = pgTable('devices', {
    id:  serial('id').primaryKey(),
    name: text('name').notNull(),
    model: text('model'),
    ip: text('ip').notNull(),
    macaddress: text('macaddress').notNull(),
    ...track()
})

export const devicesRelations = relations(devices, ({ one, many }) => {
    return {
        entities: many(EntityServices)
    }
})




// // DCU table (name, ip, mac address)
// // slaves(EM, IG -> water meter, gas meter) (sid, macaddress)
// // device parameter
