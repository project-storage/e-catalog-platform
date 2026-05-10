import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router';
import api from '@/lib/api';
import United from '@/assets/United.png';
import fontRegular from '@/assets/fonts/Kanit-Regular.ttf';
import fontBold from '@/assets/fonts/Kanit-Bold.ttf';

// Register fonts
Font.register({
  family: 'Kanit',
  fonts: [
    { src: fontRegular, fontWeight: 'normal' },
    { src: fontBold, fontWeight: 'bold' },
  ],
});

const PdfViewPage = () => {
  const [dataOrder, setDataOrder] = useState(null);
  const { id } = useParams();
  const today = new Date();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/order/info/${id}`);
        setDataOrder(res.data.data);
      } catch (error) {
        console.error("Error fetching order for PDF:", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!dataOrder) {
    return <div className="flex items-center justify-center h-screen">กำลังเตรียมเอกสาร...</div>;
  }

  const vat = dataOrder.totalPrice * 0.07;
  const totalWithVat = parseFloat(dataOrder.totalPrice) + vat;
  const dateStr = `${today.getDate()}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear() + 543}`;

  // Generate table rows logic same as legacy
  const renderTableRows = () => {
    const rows = [];
    let currentCategory = "";

    dataOrder.products?.forEach((item, index) => {
      if (item.product?.category?.name !== currentCategory) {
        rows.push(
          <View style={styles.tr} key={`cat-${index}`}>
            <View style={{ width: "100%" }}>
              <Text style={{ fontSize: 10, borderBottom: 1, borderTop: 1, paddingLeft: "10px", fontWeight: 'bold' }}>
                {item.product?.category?.name}
              </Text>
            </View>
          </View>
        );
        currentCategory = item.product?.category?.name;
      }

      rows.push(
        <View style={styles.tr} key={index}>
          <View style={{ width: "10%", borderRight: 1 }}>
            <Text style={styles.text}>{index + 1}</Text>
          </View>
          <View style={{ width: "30%", borderRight: 1 }}>
            <Text style={[styles.text, { textAlign: 'left', paddingLeft: 5 }]}>{item.product?.name}</Text>
          </View>
          <View style={{ width: "10%", borderRight: 1 }}>
            <Text style={styles.text}></Text>
          </View>
          <View style={{ width: "10%", borderRight: 1 }}>
            <Text style={styles.text}>{item.qty}</Text>
          </View>
          <View style={{ width: "10%", borderRight: 1 }}>
            <Text style={styles.text}></Text>
          </View>
          <View style={{ width: "10%", borderRight: 1 }}>
            <Text style={styles.text}>{Number(item.product?.price).toLocaleString()}</Text>
          </View>
          <View style={{ width: "5%", borderRight: 1 }}>
            <Text style={styles.text}>{item.discount}</Text>
          </View>
          <View style={{ width: "15%" }}>
            <Text style={[styles.text, { textAlign: 'right', paddingRight: 5 }]}>{Number(item.finalPrice).toLocaleString()}</Text>
          </View>
        </View>
      );
    });
    return rows;
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }}>
      <Document title={`Quotation-${dataOrder.estNo}`}>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.boxImage}>
              <Image src={United} style={styles.companyLogo} />
            </View>
            <View style={styles.boxCompany}>
              <Text style={styles.Textcompany}>บริษัท ยูไนเต็ด แมนยูเฟคเจอริ่ง จำกัด </Text>
              <Text style={styles.Textcompany}>99/99 หมู่ที่2 ตำบลหอมเกล็ด </Text>
              <Text style={styles.Textcompany}>อำเภอสามพราน จังหวัดนครปฐม 73110</Text>
              <Text style={styles.Textcompany}>โทรศัพท์ 0-3438-8672-3 โทรสาร 0-3438-8674</Text>
            </View>
          </View>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>www.unitedmanufacturing.co.th</Text>
          </View>
          
          <View style={styles.separatorLine} />
          
          <View style={styles.boxDescCus}>
            <View style={styles.boxCustomer}>
              <Text style={styles.textCustomer}>Attention :</Text>
              <Text style={styles.textCustomer}>Customer : {`${dataOrder.customer?.title} ${dataOrder.customer?.firstName} ${dataOrder.customer?.lastName}`}</Text>
              <Text style={styles.textCustomer}>Address : {dataOrder.customer?.address}</Text>
              <Text style={styles.textCustomer}>Tel.&Fax : {dataOrder.customer?.tel}</Text>
              <Text style={styles.textCustomer}>Email : {dataOrder.customer?.email}</Text>
              <Text style={styles.textCustomer}>Project : {dataOrder.project}</Text>
            </View>
            <View style={styles.boxCatagory}>
              <Text style={[styles.textCatagory, { fontWeight: 'bold', fontSize: 14 }]}>ใบเสนอราคา</Text>
              <Text style={[styles.textCatagory, { fontWeight: 'bold' }]}>QUOTATION</Text>
              <View style={{ margin: 5 }} />
              <Text style={styles.textCatagory}>Est. No. : {dataOrder.estNo}</Text>
              <Text style={styles.textCatagory}>Date : {dateStr}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.textBold}>บริษัทฯ มีความยินดีเสนอราคาดังรายละเอียดต่อไปนี้</Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tHead}>
              <View style={{ width: "10%", borderRight: 1 }}><Text style={styles.textHead}>Item</Text></View>
              <View style={{ width: "30%", borderRight: 1 }}><Text style={styles.textHead}>Description</Text></View>
              <View style={{ width: "10%", borderRight: 1 }}><Text style={styles.textHead}>Particle</Text></View>
              <View style={{ width: "10%", borderRight: 1 }}><Text style={styles.textHead}>Qty</Text></View>
              <View style={{ width: "10%", borderRight: 1 }}><Text style={styles.textHead}>Unit</Text></View>
              <View style={{ width: "10%", borderRight: 1 }}><Text style={styles.textHead}>Unit Price</Text></View>
              <View style={{ width: "5%", borderRight: 1 }}><Text style={styles.textHead}>Dis%</Text></View>
              <View style={{ width: "15%" }}><Text style={styles.textHead}>Total Price</Text></View>
            </View>

            {renderTableRows()}

            <View style={{ borderBottom: 1, borderTop: 1 }}>
              <View style={{ width: "100%" }}>
                <Text style={{ marginLeft: "15px", fontSize: 10, color: "red" }}>ราคานี้ไม่รวมค่าจัดส่ง</Text>
              </View>
            </View>

            <View style={styles.tr}>
              <View style={{ width: "70%", borderRight: 1 }}>
                <Text style={{ paddingLeft: "15px", fontSize: 10, backgroundColor: "#6FBA44" }}>เงื่อนไข : เครดิต 30 วัน</Text>
              </View>
              <View style={{ width: "15%", borderRight: 1 }}><Text style={styles.text}>Total</Text></View>
              <View style={{ width: "15%" }}>
                <Text style={{ textAlign: "right", fontSize: 10, paddingRight: 5 }}>{parseFloat(dataOrder.totalPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
              </View>
            </View>

            <View style={styles.tr}>
              <View style={{ width: "70%", borderRight: 1, backgroundColor: "#6FBA44" }}>
                <Text style={{ marginLeft: "15px", fontSize: 10 }}>Validity : 7 วัน นับจากวันที่เสนอราคา</Text>
              </View>
              <View style={{ width: "15%", borderRight: 1 }}><Text style={styles.text}>VAT 7%</Text></View>
              <View style={{ width: "15%" }}>
                <Text style={{ textAlign: "right", fontSize: 10, paddingRight: 5 }}>{vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
              </View>
            </View>

            <View style={styles.tr}>
              <View style={{ width: "70%", borderRight: 1, backgroundColor: "#6FBA44" }}>
                <Text style={{ marginLeft: "15px", fontSize: 10 }}>หมายเหตุ : กรณีที่มีการเปลี่ยนแปลงจากรายละเอียดที่เสนอราคาบริษัทขอสงวนสิทธิ์ในการเสนอ</Text>
              </View>
              <View style={{ width: "15%", borderRight: 1, borderTop: 1 }}><Text style={[styles.text, { fontWeight: 'bold' }]}>Total Amount</Text></View>
              <View style={{ width: "15%", borderTop: 1 }}>
                <Text style={{ textAlign: "right", fontSize: 10, paddingRight: 5, fontWeight: 'bold' }}>{totalWithVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
              </View>
            </View>
          </View>

          {/* Footer Signature */}
          <View style={styles.boxFooter}>
            <View style={styles.subBoxFooter}>
              <Text style={styles.footer}>.............{dataOrder.sale && `${dataOrder.sale.title}${dataOrder.sale.firstName}  ${dataOrder.sale.lastName}`}................</Text>
              <Text style={styles.footer}>Sales Marketing Director</Text>
              <Text style={styles.footer}>Tel: {dataOrder.sale?.tel}</Text>
            </View>
            <View style={styles.subBoxFooter}>
              <View style={styles.whFull}>
                <Text style={{ fontSize: 10, textAlign: "center" }}>ลงชื่อ........{dataOrder.customer && `${dataOrder.customer.title}${dataOrder.customer.firstName}  ${dataOrder.customer.lastName}`}.........ผู้สั่งซื้อ</Text>
                <Text style={{ fontSize: 10, textAlign: "center", marginTop: 5 }}>วันที่....{today.getDate()}...../........{(today.getMonth() + 1).toString().padStart(2, "0")}....../....{today.getFullYear() + 543}....</Text>
                <Text style={{ fontSize: 10, textAlign: "center", marginTop: 5 }}>ยืนยันการสั่งซื้อตามรายการนี้</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PdfViewPage;

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Kanit',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  boxImage: {
    width: '20%',
  },
  companyLogo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  boxCompany: {
    width: '75%',
  },
  Textcompany: {
    fontSize: 10,
    textAlign: 'right',
  },
  linkContainer: {
    marginTop: 2,
  },
  linkText: {
    fontSize: 10,
    color: '#317EA9',
  },
  separatorLine: {
    width: '100%',
    borderBottom: 1,
    borderColor: '#000',
    marginVertical: 8,
  },
  boxDescCus: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  boxCustomer: {
    width: '60%',
    border: 1,
    padding: 5,
  },
  textCustomer: {
    fontSize: 10,
    marginBottom: 2,
  },
  boxCatagory: {
    width: '40%',
    border: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCatagory: {
    fontSize: 10,
    textAlign: 'center',
  },
  textBold: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 15,
    marginVertical: 5,
  },
  table: {
    border: 1,
  },
  tHead: {
    flexDirection: 'row',
    backgroundColor: '#6FBA44',
    borderBottom: 1,
  },
  textHead: {
    fontSize: 10,
    textAlign: 'center',
    padding: 2,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    padding: 2,
  },
  tr: {
    flexDirection: 'row',
    borderBottom: 0.5,
    borderColor: '#eee',
    minHeight: 18,
    alignItems: 'center',
  },
  boxFooter: {
    flexDirection: 'row',
    marginTop: 30,
    height: 100,
  },
  subBoxFooter: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  whFull: {
    width: '90%',
    border: 1,
    padding: 10,
    justifyContent: 'center',
  }
});
