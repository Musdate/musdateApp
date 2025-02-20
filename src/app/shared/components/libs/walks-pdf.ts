import { CurrencyPipe } from "@angular/common";
import { format } from "date-fns";
import { es } from 'date-fns/locale/es';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Pet } from "src/app/core/interfaces/walk.interface";
import { LogoLadriaventuras } from "../../../../assets/LogoLadriaventuras";
import { User } from "src/app/core/interfaces";

(pdfMake as any).vfs = pdfFonts.vfs;

const generatePDF = ( pet: Pet, user: User | null ) => {

    const userName = user?.name;
    const bColombia = user?.banks.find(( bank ) => bank.name === 'Bancolombia' )?.number;
    const bNequi = user?.banks.find(( bank ) => bank.name === 'Nequi' )?.number;
    const currencyPipe = new CurrencyPipe('en-US');
    const date = new Date();
    let formatedLongDate = format( date, "EEEE dd 'de' MMMM, yyyy", { locale: es } );
    formatedLongDate = formatedLongDate.charAt(0).toUpperCase() + formatedLongDate.slice(1);
    const formatedShortDate = format( date, "yyyyMMdd");

    const tableBody = [
        [
            { text: "Fecha", style: "tableHeader" },
            { text: "Estado", style: "tableHeader" },
        ],
        ...pet.walks.filter(( walk ) => !walk.paid )
                    .map(( walk ) => [ walk.date, 'Pendiente' ]),
    ];

    const totalPrice = pet.totalPrice;
    const totalPending = pet.pendingPrice;

    const content: any[] = [];

    // Margin: [Left, Top, ..]

    content.push({
        text: `LADRIAVENTURAS`, style: "title", alignment: "center", margin: [ 0, 0, 0, 20 ],
    })

    content.push({
        columns: [
            { image: LogoLadriaventuras.miVar, width: 100 },
            {
                stack: [
                    {
                        text: [
                            { text: 'Fecha: ', style: "header" },
                            { text: formatedLongDate, style: "subheader" }
                        ],
                        alignment: "left",
                        margin: [ 10, 0, 0, 0 ]
                    },
                    {
                        text: [
                            { text: 'Paseos de: ', style: "header" },
                            { text: pet.name, style: "subheader" }
                        ],
                        alignment: "left",
                        margin: [ 10, 0, 0, 0 ]
                    },
                    {
                        text: [
                            { text: 'Frecuencia de paseos: ', style: "header" },
                            { text: pet.comment, style: "subheader" }
                        ],
                        alignment: "left",
                        margin: [ 10, 0, 0, 0 ]
                    },
                    {
                        text: [
                            { text: 'Paseadora: ', style: "header" },
                            { text: userName, style: "subheader" }
                        ],
                        alignment: "left",
                        margin: [ 10, 0, 0, 0 ]
                    },
                    ...( bColombia ? [
                        {
                            text: [
                                { text: 'Bancolombia: ', style: "header" },
                                { text: bColombia, style: "subheader" }
                            ],
                            alignment: "left",
                            margin: [ 10, 0, 0, 0 ]
                        }
                    ] : []),
                    ...( bNequi ? [
                        {
                            text: [
                                { text: 'Nequi: ', style: "header" },
                                { text: bNequi, style: "subheader" }
                            ],
                            alignment: "left",
                            margin: [ 10, 0, 0, 0 ]
                        }
                    ] : [])
                ],
            },
        ],
    });

    content.push({ text: "\n" });

    content.push({
        table: {
            headerRows: 1,
            widths: [ "*", "*" ],
            body: tableBody,
        },
        alignment: "center",
        layout: "lightHorizontalLines",
        margin: [ 0, 10, 0, 10 ],
    });

    content.push({
        columns: [
            { text: "", width: "*" },
            {
                text: [
                    { text: 'Total Pendiente: ', style: "total" },
                    { text: currencyPipe.transform( totalPending, 'USD' ) }
                ],
                alignment: "right",
                margin: [ 0, 20, 0, 10 ]
            },
        ],
    });

    // content.push({
    //     columns: [
    //         { text: "", width: "*" },
    //         {
    //             text: [
    //                 { text: 'Total General: ', style: "total" },
    //                 { text: currencyPipe.transform( totalPrice, 'USD' )}
    //             ],
    //             alignment: "right",
    //             margin: [ 0, 10, 0, 10 ]
    //         },
    //     ],
    // });

    const styles = {
        title: {
            fontSize: 16,
            bold: true,
        },
        header: {
            fontSize: 14,
            bold: true,
        },
        subheader: {
            fontSize: 12,
            margin: [ 0, 5, 0, 5 ],
        },
        tableHeader: {
            bold: true,
            fontSize: 12,
            color: "black",
        },
        total: {
            fontSize: 12,
            bold: true,
        },
    };

    const docDefinition: any = {
        content,
        styles,
    };

    pdfMake.createPdf(docDefinition).download(`Paseos_${ pet.name }_${ formatedShortDate }.pdf`);
};

export default generatePDF;