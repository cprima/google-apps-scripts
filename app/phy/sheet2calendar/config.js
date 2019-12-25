//per-installation configuration
var input_spreadsheetId = "1Tp6IgAaJVI095kf7yy3-repxhhO6JOcWP45pDKIUUug"
var input_sheetName = "scripttest"
var output_calendarId = 'rduj0dg7lrdgahm4qc6btdh7s0@group.calendar.google.com';

//general
var datatemplate = {
    action: '',
    SchichtID: '',
    date: '',
    Location: '',
    event_id: '',
    created_at: new Date(),
    updated_at: new Date()
};

//schichtplanung
var schichtplanung = {
    //'from': new Date('2020-01-01'),
    //'thru': new Date('2099-12-31'),
    'Dienstzeiten': {
        'F': {
            start_time_hours: 7,
            start_time_minutes: 0,
            end_time: '15:30:00',
            end_time_hours: 15,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Frühdienst'
        },
        'Z': {
            start_time_hours: 9,
            start_time_minutes: 0,
            start_time: '09:30:00',
            end_time: '18:00:00',
            end_time_hours: 18,
            end_time_minutes: 0,
            end_offset: 0,
            description: 'Zwischendienst'
        },
        'Z1': {
            start_time_hours: 8,
            start_time_minutes: 0,
            start_time: '08:00:00',
            end_time: '16:30:00',
            end_time_hours: 16,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Zwischendienst'
        },
        'S': {
            start_time_hours: 14,
            start_time_minutes: 0,
            start_time: '14:00:00',
            end_time: '22:30:00',
            end_time_hours: 22,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Spätdienst'
        },
        'N': {
            start_time_hours: 22,
            start_time_minutes: 0,
            start_time: '22:00:00',
            end_time: '07:30:00',
            end_time_hours: 7,
            end_time_minutes: 30,
            end_offset: 1,
            description: 'Nachtdienst'
        },
        'FW': {
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
            start_time_hours: 10,
            start_time_minutes: 0,
            start_time: '10:00:00',
            end_time: '22:30:00',
            end_time_hours: 22,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Zwischendienst WE'
        },
        'OAF': {
            start_time_hours: 7,
            start_time_minutes: 0,
            start_time: '07:00:00',
            end_time: '15:30:00',
            end_time_hours: 15,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Oberarzt‐Frühdienst'
        },
        'OAS': {
            start_time_hours: 14,
            start_time_minutes: 0,
            start_time: '14:00:00',
            end_time: '22:30:00',
            end_time_hours: 22,
            end_time_minutes: 30,
            end_offset: 0,
            description: 'Oberarzt‐Spätdienst'
        },
        'RD': {
            start_time_hours: 12,
            start_time_minutes: 0,
            start_time: '12:00:00',
            end_time: '20:00:00',
            end_time_hours: 20,
            end_time_minutes: 0,
            end_offset: 0,
            description: 'Rufdienst'
        }
    }
}