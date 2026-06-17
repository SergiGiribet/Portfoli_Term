-- Public bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read
create policy "project_images_public_read"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Admin upload (authenticated users only)
create policy "project_images_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

-- Admin delete
create policy "project_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
