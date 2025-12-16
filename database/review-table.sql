-- Create the review table
CREATE TABLE IF NOT EXISTS public.review (
  review_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_text   TEXT NOT NULL,
  review_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  inv_id        INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  account_id    INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON public.review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON public.review(account_id);
