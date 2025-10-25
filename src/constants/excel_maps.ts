export const templateConfig = {
    port: {
        headers: ['PORT_NAME', 'PORT_CODE'],
        map: {
            'PORT_NAME': 'port_name',
            'PORT_CODE': 'port_code',
        },
        fileName: 'port_template.xlsx',
        sheetName: 'Ports Template'
    },
    vendor: {
        headers: [
            'VENDOR_NAME', 
            'VENDOR_TYPE', 
            'CREDIT_DAYS',
            'CITY',
            'ADDRESS',
            'STATE',
            'COUNTRY',
            'PIN_CODE',
            'TELEPHONE',
            'MOBILE_NUMBER',
            'FAX',
            'GST_NUMBER',
            'PAN_NUMBER'
        ],
        map: {
            'VENDOR_NAME': 'vendor_name',
            'VENDOR_TYPE': 'vendor_type',
            'CREDIT_DAYS': 'credit_days',
            'CITY': 'city',
            'ADDRESS': 'address',
            'STATE': 'state',
            'COUNTRY': 'country',
            'PIN_CODE': 'pin_code',
            'TELEPHONE': 'telephone',
            'MOBILE_NUMBER': 'mobile_number',
            'FAX': 'fax',
            'GST_NUMBER': 'gst_number',
            'PAN_NUMBER': 'pan_number'
        },
        fileName: 'vendor_template.xlsx',
        sheetName: 'Vendors Template'
    }
};

export type TemplateModule = keyof typeof templateConfig;