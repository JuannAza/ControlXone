alter table public.catalogo_qr
  alter column codigo drop identity if exists;

alter table public.catalogo_qr
  alter column codigo type text
  using case
    when codigo::text ~ '^CTRL-[0-9]{3,}$' then codigo::text
    else 'CTRL-' || lpad(codigo::text, 3, '0')
  end;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalogo_qr_codigo_format_check'
      and conrelid = 'public.catalogo_qr'::regclass
  ) then
    alter table public.catalogo_qr
      add constraint catalogo_qr_codigo_format_check
      check (codigo ~ '^CTRL-[0-9]{3,}$' and substring(codigo from 6) ~ '[1-9]');
  end if;
end
$$;
