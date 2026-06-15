.PHONY: install dev build test lint check deploy backup

install:
	cd apps/web && npm install

dev:
	cd apps/web && npm run dev

build:
	cd apps/web && npm run build

test:
	cd apps/web && npm run test

test-coverage:
	cd apps/web && npm run test:coverage

lint:
	cd apps/web && npm run lint

check:
	cd apps/web && npm run check

format:
	cd apps/web && npm run format

db-push:
	cd apps/web && npm run db:push

db-generate:
	cd apps/web && npm run db:generate

db-migrate:
	cd apps/web && npm run db:migrate

db-seed:
	cd apps/web && npx tsx db/seed.ts

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

backup:
	./scripts/backup.sh

health:
	./scripts/health-check.sh

clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf {} +
	find . -name 'dist' -type d -prune -exec rm -rf {} +
	find . -name '.turbo' -type d -prune -exec rm -rf {} +
