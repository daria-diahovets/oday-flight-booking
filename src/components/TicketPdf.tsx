import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { OrderDetail } from '../types/order';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica', color: '#000' },
  title: { fontSize: 20, marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { color: '#333' },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    borderBottom: '1px solid #000',
    paddingBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottom: '1px solid #ccc',
  },
  colName: { width: '50%' },
  colType: { width: '25%' },
  colPrice: { width: '25%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    fontSize: 14,
  },
});

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface TicketPdfProps {
  order: OrderDetail;
}

const TicketPdf = ({ order }: TicketPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Flight Ticket</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Order ID</Text>
        <Text>#{order.id.slice(0, 8).toUpperCase()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Purchase Date</Text>
        <Text>{formatDateTime(order.created_at)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Airline</Text>
        <Text>{order.airline_name}</Text>
      </View>

      <Text style={styles.section}>Flight</Text>
      <View style={styles.row}>
        <Text style={styles.label}>From</Text>
        <Text>
          {order.origin_city} - {formatDateTime(order.departure_time)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To</Text>
        <Text>
          {order.destination_city} - {formatDateTime(order.arrival_time)}
        </Text>
      </View>

      <Text style={styles.section}>Passengers</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.colName}>Name</Text>
        <Text style={styles.colType}>Type</Text>
        <Text style={styles.colPrice}>Price</Text>
      </View>
      {order.tickets.map((ticket, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.colName}>
            {ticket.first_name} {ticket.last_name}
          </Text>
          <Text style={styles.colType}>{ticket.type}</Text>
          <Text style={styles.colPrice}>
            €{Number(ticket.price).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text>Total Paid</Text>
        <Text>€{Number(order.total_price).toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default TicketPdf;
