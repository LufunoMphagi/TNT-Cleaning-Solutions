import type {Metadata} from 'next';
import PolicyLayout from '../policy-layout';
import {bookingPolicy} from '../../lib/policies';
export const metadata:Metadata={title:'Booking Terms | TNT Cleaning Solutions',description:'Quote-based cleaning, 24-hour notice, availability, changes and travel charges for TNT Cleaning Solutions.'};
export default function Terms(){return <PolicyLayout title="Clear from the start." label="TNT BOOKING TERMS">
<p>These terms explain how cleaning requests and quotations are handled. Please read your final quotation for the agreed scope, price and any job-specific conditions.</p>
<h2>1. Quotations and prices</h2><p>{bookingPolicy.pricing} TNT reviews the size, condition, location and scope of your job before giving a price. Any change to scope or additional charge must be discussed and agreed before the extra work is performed.</p>
<h2>2. Notice and availability</h2><p>Allow at least {bookingPolicy.noticeHours} hours before the start of your preferred appointment window. {bookingPolicy.days} Operating hours are 08:00–17:00. The date and time submitted online are preferences; wait for explicit TNT confirmation before treating an appointment as booked.</p>
<h2>3. Cancellation and rescheduling</h2><p>{bookingPolicy.changes} Contact the team directly on 083 284 7316 or 073 760 7697 so that your request can be recorded and the schedule updated.</p>
<h2>4. Coverage and travel</h2><p>TNT serves Gauteng. {bookingPolicy.travel} Availability at a particular address is confirmed during quotation or booking review.</p>
<h2>5. Preparing for a visit</h2><p>Provide accurate contact, address and job details, and tell TNT about access arrangements or relevant safety concerns before the appointment. Explain any special requirements so that the team can confirm whether the service is suitable.</p>
<h2>6. Payments</h2><p>This website does not collect online payments or automatically charge subscriptions. TNT will communicate payment arrangements as part of the quotation or booking confirmation. A request for recurring cleaning does not authorise automatic charges.</p>
<h2>7. Questions and service concerns</h2><p>Contact Thabang promptly with questions, changes or concerns about a service, quoting your request reference where available. Your statutory rights remain applicable.</p>
<h2>8. Privacy</h2><p>Our <a href="/privacy">privacy policy</a> explains how service information, uploaded photos and email authorisation are handled.</p>
</PolicyLayout>}
