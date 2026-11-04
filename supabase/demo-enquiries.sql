-- DEMO ENQUIRIES (generated). OPTIONAL and for demonstrations only. Every row has
-- is_demo = true and a DEMO- reference, so they are never confused with real customer enquiries.

with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0001', 'Sample Contact A', 'Sample Company A', 'a@example.com', '+973 0000 0001', 600, 'BHD 1,000 – 2,500', '2026-12-15', 'Laser-engraved logo on bottle body.', 'Illustrative record.', 'new', true, '2026-11-02T08:30:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Stainless Steel Vacuum Bottle', 300), ('Custom Leather Notebook', 300)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0002', 'Sample Contact B', 'Sample Company B', 'b@example.com', '+973 0000 0002', 120, 'BHD 2,500 – 5,000', null, 'Hot-foil logo on box lid, personalised cards.', 'Illustrative demo record.', 'new', true, '2026-11-01T11:10:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Premium Executive Gift Box', 120)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0003', 'Sample Contact C', 'Sample Company C', 'c@example.com', '+973 0000 0003', 160, null, null, 'Embroidery on left chest.', 'Illustrative demo record.', 'contacted', true, '2026-10-29T09:00:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Corporate Hoodie', 80), ('Premium Corporate Backpack', 80)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0004', 'Sample Contact D', 'Sample Company D', 'd@example.com', '+973 0000 0004', 1000, 'BHD 5,000+', null, null, 'Illustrative demo record.', 'quotation_sent', true, '2026-10-24T13:45:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Corporate Conference Kit', 500), ('Branded Canvas Tote Bag', 500)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0005', 'Sample Contact E', 'Sample Company E', 'e@example.com', '+973 0000 0005', 25, null, null, null, 'Illustrative demo record.', 'approved', true, '2026-10-18T07:20:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Engraved Crystal Award', 25)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0006', 'Sample Contact F', 'Sample Company F', 'f@example.com', '+973 0000 0006', 60, null, null, null, 'Illustrative demo record.', 'completed', true, '2026-09-30T10:05:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Employee Welcome Kit', 60)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0007', 'Sample Contact G', 'Sample Company G', 'g@example.com', '+973 0000 0007', 150, null, null, null, 'Illustrative demo record.', 'completed', true, '2026-09-12T12:00:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Luxury Gift Hamper', 150)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0008', 'Sample Contact H', 'Sample Company H', 'h@example.com', '+973 0000 0008', 200, null, null, null, 'Illustrative demo record.', 'cancelled', true, '2026-09-04T15:30:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Custom USB Drive', 200)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0009', 'Sample Contact I', 'Sample Company I', 'i@example.com', '+973 0000 0009', 300, null, null, null, 'Illustrative demo record.', 'contacted', true, '2026-10-27T08:10:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Wireless Charging Station', 150), ('Branded Power Bank', 150)) as v(name, qty);
with e as (
  insert into public.enquiries (enquiry_number, customer_name, company_name, email, phone, quantity, budget_range, delivery_date, customization_requirements, notes, status, is_demo, created_at)
  values ('DEMO-0010', 'Sample Contact J', 'Sample Company J', 'j@example.com', '+973 0000 0010', 400, null, null, null, 'Illustrative demo record.', 'new', true, '2026-11-03T06:55:00Z')
  on conflict (enquiry_number) do nothing returning id)
insert into public.enquiry_items (enquiry_id, product_name, quantity)
select e.id, v.name, v.qty from e, (values ('Customized Travel Mug', 400)) as v(name, qty);
