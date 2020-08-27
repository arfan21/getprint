module.exports = {
    type: "bubble",
    size: "giga",
    header: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "INVOICE",
                color: "#0029FF",
                weight: "bold",
                align: "start",
                size: "lg",
            },
        ],
    },
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "NAMA FC",
                size: "lg",
                color: "#0029FF",
                weight: "bold",
            },
            {
                type: "text",
                text: "alamat",
                color: "#0029FF",
            },
        ],
        margin: "xs",
    },
    footer: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Penerima",
                        color: "#979797",
                        offsetStart: "10px",
                    },
                    {
                        type: "text",
                        text: "Nama",
                        offsetStart: "10px",
                    },
                ],
                margin: "lg",
            },
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Alamat Penerima",
                        color: "#979797",
                        offsetStart: "10px",
                    },
                    {
                        type: "text",
                        text: "solo",
                        offsetStart: "10px",
                    },
                ],
                margin: "lg",
            },
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Tanggal",
                        color: "#979797",
                        offsetStart: "10px",
                    },
                    {
                        type: "text",
                        text: "17-2-2002",
                        offsetStart: "10px",
                    },
                ],
                margin: "lg",
            },
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Hubungi Mitra",
                        color: "#FFFFFF",
                        align: "center",
                        weight: "bold",
                        size: "xl",
                        gravity: "center",
                        action: {
                            type: "uri",
                            label: "action",
                            uri: "http://linecorp.com/",
                        },
                    },
                ],
                height: "31px",
                backgroundColor: "#0029FF",
                cornerRadius: "5px",
                margin: "lg",
            },
        ],
    },
};
