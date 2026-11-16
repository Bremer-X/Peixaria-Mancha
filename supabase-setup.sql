-- ============================================================================
-- Peixaria Mancha - Setup Completo do Banco Supabase (Projeto: qnandyuygrilgptnpaeb)
-- Execute este script no SQL Editor do Supabase (Run).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabelas principais
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  delivery_time text NOT NULL DEFAULT '30-50 min',
  opening_time text NOT NULL DEFAULT '07:00',
  closing_time text NOT NULL DEFAULT '14:00',
  is_open boolean NOT NULL DEFAULT true,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  delivery_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  slug text,
  name text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  display_type text NOT NULL DEFAULT 'single',
  icon text NOT NULL DEFAULT 'Fish',
  sort_order integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_store_id_slug_idx
  ON public.categories (store_id, slug)
  WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  slug text,
  name text NOT NULL,
  badge text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 1,
  options_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS products_store_id_slug_idx
  ON public.products (store_id, slug)
  WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  code text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  fulfillment text NOT NULL DEFAULT 'delivery',
  address text NOT NULL DEFAULT '',
  reference text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'pix',
  payment_status text NOT NULL DEFAULT 'pay_on_delivery',
  change_for numeric(10,2),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  kitchen_note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'novo',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_store_created_idx
  ON public.orders (store_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  selected_options jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx
  ON public.order_items (order_id);

CREATE TABLE IF NOT EXISTS public.store_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  phone_digits text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  password_hash text NOT NULL DEFAULT '',
  neighborhood_id text NOT NULL DEFAULT '',
  street text NOT NULL DEFAULT '',
  number text NOT NULL DEFAULT '',
  complement text NOT NULL DEFAULT '',
  reference text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS store_customers_store_phone_digits_idx
  ON public.store_customers (store_id, phone_digits)
  WHERE phone_digits <> '';

-- 2. Sequência de numeração amigável dos pedidos (#1001, #1002...)
CREATE SEQUENCE IF NOT EXISTS public.peixaria_order_seq START WITH 1001;
GRANT USAGE, SELECT ON SEQUENCE public.peixaria_order_seq TO anon, authenticated;

-- 3. Função auxiliar de permissão de loja
CREATE OR REPLACE FUNCTION public.can_manage_store(p_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.stores s
    WHERE s.id = p_store_id
      AND s.owner_id = (SELECT auth.uid())
  );
$$;

-- 4. Row Level Security (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_customers ENABLE ROW LEVEL SECURITY;

-- Stores: leitura pública para o cardápio; atualização pelo dono
DROP POLICY IF EXISTS "stores_public_select" ON public.stores;
CREATE POLICY "stores_public_select"
  ON public.stores FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "stores_owner_update" ON public.stores;
CREATE POLICY "stores_owner_update"
  ON public.stores FOR UPDATE
  TO authenticated
  USING (public.can_manage_store(id))
  WITH CHECK (public.can_manage_store(id));

-- Categories: leitura pública para o cardápio; CRUD pelo dono
DROP POLICY IF EXISTS "categories_public_select" ON public.categories;
CREATE POLICY "categories_public_select"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "categories_owner_manage" ON public.categories;
CREATE POLICY "categories_owner_manage"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.can_manage_store(store_id))
  WITH CHECK (public.can_manage_store(store_id));

-- Products: leitura pública para o cardápio; CRUD pelo dono
DROP POLICY IF EXISTS "products_public_select" ON public.products;
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "products_owner_manage" ON public.products;
CREATE POLICY "products_owner_manage"
  ON public.products FOR ALL
  TO authenticated
  USING (public.can_manage_store(store_id))
  WITH CHECK (public.can_manage_store(store_id));

-- Orders: dono visualiza, atualiza e exclui; criação pública via RPC create_delivery_order
DROP POLICY IF EXISTS "orders_owner_manage" ON public.orders;
CREATE POLICY "orders_owner_manage"
  ON public.orders FOR ALL
  TO authenticated
  USING (public.can_manage_store(store_id))
  WITH CHECK (public.can_manage_store(store_id));

-- Order Items: dono gerencia itens dos pedidos da sua loja
DROP POLICY IF EXISTS "order_items_owner_manage" ON public.order_items;
CREATE POLICY "order_items_owner_manage"
  ON public.order_items FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT o.id FROM public.orders o WHERE public.can_manage_store(o.store_id)
    )
  )
  WITH CHECK (
    order_id IN (
      SELECT o.id FROM public.orders o WHERE public.can_manage_store(o.store_id)
    )
  );

-- Store Customers: dono visualiza e exclui; cadastro/atualização pública via RPC upsert_delivery_customer
DROP POLICY IF EXISTS "store_customers_owner_select" ON public.store_customers;
CREATE POLICY "store_customers_owner_select"
  ON public.store_customers FOR SELECT
  TO authenticated
  USING (public.can_manage_store(store_id));

DROP POLICY IF EXISTS "store_customers_owner_delete" ON public.store_customers;
CREATE POLICY "store_customers_owner_delete"
  ON public.store_customers FOR DELETE
  TO authenticated
  USING (public.can_manage_store(store_id));

-- 5. RPCs do Cardápio Digital e Delivery Peixaria Mancha
CREATE OR REPLACE FUNCTION public.get_delivery_catalog(
  p_store_slug text DEFAULT 'peixaria-mancha',
  p_include_unavailable boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_store record;
  v_config jsonb;
  v_categories jsonb;
  v_all_products jsonb;
BEGIN
  SELECT * INTO v_store
  FROM public.stores
  WHERE slug = p_store_slug
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'config', '{}'::jsonb,
      'categories', '[]'::jsonb,
      'allProducts', '[]'::jsonb,
      'dbMode', 'supabase'
    );
  END IF;

  v_config := COALESCE(v_store.delivery_config, '{}'::jsonb) || jsonb_build_object(
    'storeId', v_store.id,
    'storeSlug', v_store.slug,
    'storeName', v_store.name,
    'tagline', COALESCE(v_store.tagline, v_store.delivery_config->>'tagline', ''),
    'whatsapp', COALESCE(v_store.delivery_config->>'whatsapp', v_store.phone, ''),
    'estimatedTime', COALESCE(v_store.delivery_config->>'estimatedTime', v_store.delivery_time, '30-50 min')
  );

  SELECT COALESCE(jsonb_agg(prod_obj ORDER BY cat_order ASC, sort_order ASC, name ASC), '[]'::jsonb)
  INTO v_all_products
  FROM (
    SELECT
      COALESCE(c.sort_order, 99) AS cat_order,
      COALESCE(p.sort_order, 99) AS sort_order,
      p.name,
      jsonb_build_object(
        'id', COALESCE(p.slug, p.id::text),
        '_uuid', p.id,
        'categoryId', COALESCE(c.slug, p.options_config->>'categorySlug', p.category_id::text, ''),
        'categoryUuid', p.category_id,
        'name', p.name,
        'badge', COALESCE(p.badge, ''),
        'description', COALESCE(p.description, ''),
        'price', CASE WHEN COALESCE(p.options_config->>'unitType', 'KG') = 'PORÇÃO' AND (p.options_config ? 'price500ml') THEN COALESCE((p.options_config->>'price500ml')::numeric, p.price, 0) ELSE COALESCE(p.price, 0) END,
        'price250ml', CASE WHEN p.options_config ? 'price250ml' AND p.options_config->>'price250ml' IS NOT NULL THEN (p.options_config->>'price250ml')::numeric ELSE NULL END,
        'price500ml', CASE WHEN p.options_config ? 'price500ml' AND p.options_config->>'price500ml' IS NOT NULL THEN (p.options_config->>'price500ml')::numeric ELSE NULL END,
        'unitType', COALESCE(p.options_config->>'unitType', 'KG'),
        'allowWeightChoice', COALESCE((p.options_config->>'allowWeightChoice')::boolean, false),
        'isPopular', COALESCE((p.options_config->>'isPopular')::boolean, false),
        'isAvailable', COALESCE(p.is_available, true),
        'serves', COALESCE(p.options_config->>'serves', ''),
        'order', COALESCE(p.sort_order, 1),
        'image', COALESCE(p.image_url, ''),
        'priceFormatted', CASE WHEN COALESCE(p.options_config->>'unitType', 'KG') = 'PORÇÃO' THEN '' WHEN COALESCE(p.price, 0) > 0 THEN 'R$ ' || replace(to_char(p.price, 'FM999990D00'), '.', ',') ELSE '' END,
        'price250mlFormatted', CASE WHEN p.options_config ? 'price250ml' AND p.options_config->>'price250ml' IS NOT NULL THEN 'R$ ' || replace(to_char((p.options_config->>'price250ml')::numeric, 'FM999990D00'), '.', ',') ELSE '' END,
        'price500mlFormatted', CASE WHEN p.options_config ? 'price500ml' AND p.options_config->>'price500ml' IS NOT NULL THEN 'R$ ' || replace(to_char((p.options_config->>'price500ml')::numeric, 'FM999990D00'), '.', ',') ELSE '' END
      ) AS prod_obj
    FROM public.products p
    LEFT JOIN public.categories c ON c.id = p.category_id
    WHERE p.store_id = v_store.id
      AND (p_include_unavailable OR COALESCE(p.is_available, true) = true)
  ) sub;

  SELECT COALESCE(jsonb_agg(cat_obj ORDER BY sort_order ASC, name ASC), '[]'::jsonb)
  INTO v_categories
  FROM (
    SELECT
      c.sort_order,
      c.name,
      jsonb_build_object(
        'id', COALESCE(c.slug, c.id::text),
        '_uuid', c.id,
        'title', c.name,
        'subtitle', COALESCE(c.subtitle, ''),
        'type', COALESCE(c.display_type, 'single'),
        'iconName', COALESCE(c.icon, 'Fish'),
        'order', COALESCE(c.sort_order, 1),
        'isActive', COALESCE(c.is_active, true),
        'items', COALESCE((
          SELECT jsonb_agg(item_elem)
          FROM jsonb_array_elements(v_all_products) item_elem
          WHERE (item_elem->>'categoryId') = COALESCE(c.slug, c.id::text)
            AND (p_include_unavailable OR (item_elem->>'isAvailable')::boolean = true)
        ), '[]'::jsonb)
      ) AS cat_obj
    FROM public.categories c
    WHERE c.store_id = v_store.id
      AND (p_include_unavailable OR COALESCE(c.is_active, true) = true)
  ) cat_sub;

  RETURN jsonb_build_object(
    'storeId', v_store.id,
    'config', v_config,
    'categories', v_categories,
    'allProducts', v_all_products,
    'dbMode', 'supabase',
    'updatedAt', now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_delivery_catalog(text, boolean) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_delivery_order(
  p_payload jsonb,
  p_store_slug text DEFAULT 'peixaria-mancha'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_store_id uuid;
  v_order_id uuid := gen_random_uuid();
  v_seq bigint;
  v_code text;
  v_customer jsonb := COALESCE(p_payload->'customer', '{}'::jsonb);
  v_payment jsonb := COALESCE(p_payload->'payment', '{}'::jsonb);
  v_fulfillment text;
  v_payment_method text;
  v_change_raw text;
  v_change_for numeric := NULL;
  v_total numeric := COALESCE((p_payload->>'totalAmount')::numeric, 0);
  v_notes text := COALESCE(p_payload->>'generalNotes', '');
  v_item jsonb;
  v_prod_id uuid;
  v_item_slug text;
  v_qty integer;
  v_unit_price numeric;
  v_sub numeric;
BEGIN
  SELECT id INTO v_store_id
  FROM public.stores
  WHERE slug = p_store_slug
  LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'Loja não encontrada: %', p_store_slug;
  END IF;

  v_seq := nextval('public.peixaria_order_seq');
  v_code := '#' || v_seq::text;

  v_fulfillment := CASE
    WHEN lower(COALESCE(v_customer->>'modality', 'delivery')) = 'pickup' THEN 'pickup'
    ELSE 'delivery'
  END;

  v_payment_method := lower(COALESCE(v_payment->>'method', 'pix'));
  IF v_payment_method NOT IN ('pix', 'card', 'credit', 'debit', 'cash') THEN
    v_payment_method := 'pix';
  END IF;

  v_change_raw := regexp_replace(replace(COALESCE(v_payment->>'changeFor', ''), ',', '.'), '[^0-9.]', '', 'g');
  IF v_change_raw <> '' THEN
    BEGIN
      v_change_for := v_change_raw::numeric;
    EXCEPTION WHEN OTHERS THEN
      v_change_for := NULL;
    END;
  END IF;

  INSERT INTO public.orders (
    id, store_id, code, customer_name, customer_phone,
    fulfillment, address, reference,
    payment_method, payment_status, change_for,
    subtotal, delivery_fee, total, kitchen_note, status
  ) VALUES (
    v_order_id,
    v_store_id,
    v_code,
    COALESCE(NULLIF(trim(v_customer->>'name'), ''), 'Cliente Delivery'),
    COALESCE(NULLIF(trim(v_customer->>'whatsapp'), ''), 'Não informado'),
    v_fulfillment,
    COALESCE(v_customer->>'address', ''),
    COALESCE(v_customer->>'reference', ''),
    v_payment_method,
    'pay_on_delivery',
    v_change_for,
    GREATEST(v_total, 0),
    0,
    GREATEST(v_total, 0),
    v_notes,
    'novo'
  );

  FOR v_item IN SELECT * FROM jsonb_array_elements(COALESCE(p_payload->'items', '[]'::jsonb))
  LOOP
    v_item_slug := COALESCE(v_item->>'menuItemId', v_item->>'productId', v_item->>'id', '');
    v_prod_id := NULL;

    IF v_item_slug <> '' THEN
      SELECT p.id INTO v_prod_id
      FROM public.products p
      WHERE p.store_id = v_store_id
        AND (p.slug = v_item_slug OR p.id::text = v_item_slug)
      LIMIT 1;
    END IF;

    v_qty := GREATEST(COALESCE((v_item->>'quantity')::integer, 1), 1);
    v_unit_price := GREATEST(COALESCE((v_item->>'price')::numeric, 0), 0);
    v_sub := GREATEST(COALESCE((v_item->>'subtotal')::numeric, v_unit_price * v_qty), 0);

    INSERT INTO public.order_items (
      order_id, product_id, product_name, quantity, unit_price, subtotal, selected_options, notes
    ) VALUES (
      v_order_id,
      v_prod_id,
      COALESCE(v_item->>'name', 'Item'),
      v_qty,
      v_unit_price,
      v_sub,
      jsonb_build_object(
        'portion', COALESCE(v_item->>'portion', ''),
        'categoryId', COALESCE(v_item->>'categoryId', ''),
        'menuItemId', v_item_slug
      ),
      COALESCE(v_item->>'notes', '')
    );
  END LOOP;

  RETURN jsonb_build_object(
    '_id', v_order_id,
    'id', v_order_id,
    'orderNumber', v_seq,
    'orderCode', v_code,
    'status', 'novo',
    'totalAmount', v_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_delivery_order(jsonb, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.restore_delivery_catalog(
  p_store_slug text DEFAULT 'peixaria-mancha',
  p_backup jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_store_id uuid;
  v_config jsonb;
  v_cat jsonb;
  v_prod jsonb;
  v_cat_uuid uuid;
  v_cat_slug text;
  v_prod_slug text;
  v_base_price numeric;
  v_products_arr jsonb;
BEGIN
  SELECT id INTO v_store_id
  FROM public.stores
  WHERE slug = p_store_slug
  LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'Loja não encontrada: %', p_store_slug;
  END IF;

  IF NOT public.can_manage_store(v_store_id) THEN
    RAISE EXCEPTION 'Sem permissão para restaurar o catálogo desta loja.';
  END IF;

  IF p_backup ? 'config' AND jsonb_typeof(p_backup->'config') = 'object' THEN
    v_config := p_backup->'config';
    UPDATE public.stores
    SET delivery_config = v_config,
        tagline = COALESCE(v_config->>'tagline', tagline),
        phone = COALESCE(v_config->>'whatsapp', phone),
        delivery_time = COALESCE(v_config->>'estimatedTime', delivery_time),
        updated_at = now()
    WHERE id = v_store_id;
  END IF;

  IF p_backup ? 'categories' AND jsonb_typeof(p_backup->'categories') = 'array' THEN
    FOR v_cat IN SELECT * FROM jsonb_array_elements(p_backup->'categories')
    LOOP
      v_cat_slug := COALESCE(NULLIF(trim(v_cat->>'id'), ''), lower(regexp_replace(COALESCE(v_cat->>'title', 'cat'), '[^a-zA-Z0-9]+', '-', 'g')));
      INSERT INTO public.categories (store_id, slug, name, subtitle, display_type, icon, sort_order, is_active)
      VALUES (
        v_store_id,
        v_cat_slug,
        COALESCE(v_cat->>'title', v_cat->>'name', 'Categoria'),
        COALESCE(v_cat->>'subtitle', ''),
        COALESCE(v_cat->>'type', 'single'),
        COALESCE(v_cat->>'iconName', 'Fish'),
        COALESCE((v_cat->>'order')::int, 1),
        COALESCE((v_cat->>'isActive')::boolean, true)
      )
      ON CONFLICT (store_id, slug) WHERE slug IS NOT NULL DO UPDATE SET
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        display_type = EXCLUDED.display_type,
        icon = EXCLUDED.icon,
        sort_order = EXCLUDED.sort_order,
        is_active = EXCLUDED.is_active;
    END LOOP;
  END IF;

  v_products_arr := CASE
    WHEN p_backup ? 'products' AND jsonb_typeof(p_backup->'products') = 'array' THEN p_backup->'products'
    WHEN p_backup ? 'allProducts' AND jsonb_typeof(p_backup->'allProducts') = 'array' THEN p_backup->'allProducts'
    ELSE '[]'::jsonb
  END;

  IF jsonb_array_length(v_products_arr) > 0 THEN
    FOR v_prod IN SELECT * FROM jsonb_array_elements(v_products_arr)
    LOOP
      v_cat_slug := COALESCE(v_prod->>'categoryId', 'peixes-fritos');
      SELECT id INTO v_cat_uuid
      FROM public.categories
      WHERE store_id = v_store_id AND (slug = v_cat_slug OR id::text = v_cat_slug)
      LIMIT 1;

      v_prod_slug := COALESCE(NULLIF(trim(v_prod->>'id'), ''), lower(regexp_replace(COALESCE(v_prod->>'name', 'prato'), '[^a-zA-Z0-9]+', '-', 'g')));
      v_base_price := CASE
        WHEN COALESCE(v_prod->>'unitType', 'KG') = 'PORÇÃO' THEN COALESCE((v_prod->>'price500ml')::numeric, (v_prod->>'price250ml')::numeric, (v_prod->>'price')::numeric, 0)
        ELSE COALESCE((v_prod->>'price')::numeric, 0)
      END;

      INSERT INTO public.products (
        store_id, category_id, slug, name, badge, description, price, image_url, is_available, sort_order, options_config
      ) VALUES (
        v_store_id,
        v_cat_uuid,
        v_prod_slug,
        COALESCE(v_prod->>'name', 'Prato'),
        COALESCE(v_prod->>'badge', ''),
        COALESCE(v_prod->>'description', ''),
        GREATEST(v_base_price, 0),
        COALESCE(v_prod->>'image', ''),
        COALESCE((v_prod->>'isAvailable')::boolean, true),
        COALESCE((v_prod->>'order')::int, 1),
        jsonb_build_object(
          'unitType', COALESCE(v_prod->>'unitType', 'KG'),
          'allowWeightChoice', COALESCE((v_prod->>'allowWeightChoice')::boolean, false),
          'isPopular', COALESCE((v_prod->>'isPopular')::boolean, false),
          'serves', COALESCE(v_prod->>'serves', ''),
          'price250ml', CASE WHEN v_prod ? 'price250ml' AND v_prod->>'price250ml' IS NOT NULL THEN (v_prod->>'price250ml')::numeric ELSE NULL END,
          'price500ml', CASE WHEN v_prod ? 'price500ml' AND v_prod->>'price500ml' IS NOT NULL THEN (v_prod->>'price500ml')::numeric ELSE NULL END,
          'categorySlug', v_cat_slug
        )
      )
      ON CONFLICT (store_id, slug) WHERE slug IS NOT NULL DO UPDATE SET
        category_id = EXCLUDED.category_id,
        name = EXCLUDED.name,
        badge = EXCLUDED.badge,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        is_available = EXCLUDED.is_available,
        sort_order = EXCLUDED.sort_order,
        options_config = EXCLUDED.options_config,
        updated_at = now();
    END LOOP;
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Cardápio restaurado e sincronizado no Supabase Nuvem!');
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_delivery_catalog(text, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_delivery_customer(
  p_store_slug text DEFAULT 'peixaria-mancha',
  p_name text DEFAULT '',
  p_phone text DEFAULT '',
  p_email text DEFAULT '',
  p_neighborhood text DEFAULT '',
  p_street text DEFAULT '',
  p_number text DEFAULT '',
  p_complement text DEFAULT '',
  p_reference text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_store_id uuid;
  v_digits text;
  v_customer_id uuid;
BEGIN
  SELECT id INTO v_store_id
  FROM public.stores
  WHERE slug = p_store_slug
  LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'Loja não encontrada: %', p_store_slug;
  END IF;

  v_digits := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  IF length(v_digits) < 8 OR trim(COALESCE(p_name, '')) = '' THEN
    RAISE EXCEPTION 'Nome e WhatsApp são obrigatórios para o cadastro.';
  END IF;

  INSERT INTO public.store_customers (
    store_id, name, phone, phone_digits, email, password_hash,
    neighborhood_id, street, number, complement, reference
  ) VALUES (
    v_store_id,
    trim(p_name),
    trim(p_phone),
    v_digits,
    trim(COALESCE(p_email, '')),
    '',
    trim(COALESCE(p_neighborhood, '')),
    trim(COALESCE(p_street, '')),
    trim(COALESCE(p_number, '')),
    trim(COALESCE(p_complement, '')),
    trim(COALESCE(p_reference, ''))
  )
  ON CONFLICT (store_id, phone_digits) WHERE phone_digits <> ''
  DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    email = CASE WHEN EXCLUDED.email <> '' THEN EXCLUDED.email ELSE public.store_customers.email END,
    neighborhood_id = CASE WHEN EXCLUDED.neighborhood_id <> '' THEN EXCLUDED.neighborhood_id ELSE public.store_customers.neighborhood_id END,
    street = CASE WHEN EXCLUDED.street <> '' THEN EXCLUDED.street ELSE public.store_customers.street END,
    number = CASE WHEN EXCLUDED.number <> '' THEN EXCLUDED.number ELSE public.store_customers.number END,
    complement = CASE WHEN EXCLUDED.complement <> '' THEN EXCLUDED.complement ELSE public.store_customers.complement END,
    reference = CASE WHEN EXCLUDED.reference <> '' THEN EXCLUDED.reference ELSE public.store_customers.reference END,
    updated_at = now()
  RETURNING id INTO v_customer_id;

  RETURN jsonb_build_object(
    'id', v_customer_id,
    'name', trim(p_name),
    'phone', trim(p_phone)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_delivery_customer(text, text, text, text, text, text, text, text, text) TO anon, authenticated;

-- 6. Realtime para atualização ao vivo no Painel e Cardápio
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'stores'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stores;
  END IF;
END $$;

-- 7. Loja inicial Peixaria Mancha
INSERT INTO public.stores (
  slug,
  name,
  tagline,
  phone,
  delivery_time,
  opening_time,
  closing_time,
  is_open,
  delivery_config
)
VALUES (
  'peixaria-mancha',
  'Peixaria Mancha',
  'Qualidade que você sente, sabor que você ama!',
  '5591989379978',
  '30-50 min',
  '07:00',
  '14:00',
  true,
  '{"openHour": 7, "closeHour": 14, "manualStatus": "auto", "estimatedTime": "30-50 min", "whatsapp": "5591989379978", "tagline": "Qualidade que você sente, sabor que você ama!"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
