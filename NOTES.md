# Notes

## What I did

- Car list with responisive images, loading/error/empty states and a create form that updates the list.
- Model search (debounced) and sorting.

## What I skipped

- The optional detail page.
- A year filter currently kept the toolbar simple.
- Images for new cars, since the mock cant store them anyway.

## Decisions

- No new libraries.
- The mock returns new cars without the image fields, which broke the cache update, so I write the new record into the cache with those fields filled in.

## Next

- Detail route, browser tests for the create flow, image upload.

## Running it

`npm install` then `npm run dev`. There is no backend, its all mocked.