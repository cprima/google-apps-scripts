//per-installation configuration
var input_spreadsheetId = "1Tp6IgAaJVI095kf7yy3-repxhhO6JOcWP45pDKIUUug"
var input_sheetName = "DienstplanArmine"
//scripttest var output_calendarId = 'rduj0dg7lrdgahm4qc6btdh7s0@group.calendar.google.com';
//archamde
var output_calendarId = 'mail.prior-i.de_e0nc7mm295oj99v0u0e6cugerc@group.calendar.google.com';

//general
var datatemplate = {
    action: '',
    SchichtID: '',
    date: '',
    Location: 'Klinikum Wolfsburg',
    event_id: '',
    created_at: new Date(),
    updated_at: new Date()
};

//schichtplanung
var shiftinfo = {
    'F': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 7,
        start_time_minutes: 0,
        end_time_hours: 15,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Frühdienst'
    },
    'Z': {
        from: new Date('2020-01-01'),
        thru: new Date('2020-01-31'),
        start_time_hours: 9,
        start_time_minutes: 30,
        end_time_hours: 18,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Zwischendienst'
    },
    'Z': {
        from: new Date('2020-02-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 9,
        start_time_minutes: 30,
        end_time_hours: 18,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Zwischendienst'
    },
    'Z1': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 8,
        start_time_minutes: 0,
        end_time_hours: 16,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Zwischendienst'
    },
    'S': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 14,
        start_time_minutes: 0,
        end_time_hours: 22,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Spätdienst'
    },
    'S1': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 14,
        start_time_minutes: 0,
        end_time_hours: 22,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Spätdienst'
    },
    'N': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 22,
        start_time_minutes: 0,
        end_time_hours: 7,
        end_time_minutes: 30,
        end_offset: 1,
        description: 'Nachtdienst'
    },
    'FW': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 7,
        start_time_minutes: 0,
        start_time: '07:00:00',
        end_time: '17:00:00',
        end_time_hours: 17,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Frühdienst WE'
    },
    'ZW': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 10,
        start_time_minutes: 0,
        end_time_hours: 22,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Zwischendienst WE'
    },
    'SW': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 12,
        start_time_minutes: 0,
        end_time_hours: 22,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Spätdienst'
    },
    'OAF': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 7,
        start_time_minutes: 0,
        end_time_hours: 15,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Oberarzt‐Frühdienst'
    },
    'OAS': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 14,
        start_time_minutes: 0,
        end_time_hours: 22,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Oberarzt‐Spätdienst'
    },
    'RD': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 12,
        start_time_minutes: 0,
        end_time_hours: 20,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Rufdienst'
    }
}
