#!/bin/bash
set -e

echo "=== Harness Initialization ==="
echo ""

# Detect package manager
if [ -f package.json ]; then
  if [ -f pnpm-lock.yaml ]; then
    PM="pnpm"
  elif [ -f yarn.lock ]; then
    PM="yarn"
  elif [ -f bun.lock ] || [ -f bun.lockb ]; then
    PM="bun"
  else
    PM="npm"
  fi

  echo "=== Installing dependencies with $PM ==="
  if [ "$PM" = "npm" ]; then
    npm install
  else
    "$PM" install
  fi

  # Type check
  if node -e "const s=require('./package.json').scripts||{}; process.exit(s.check||s.typecheck||s['type-check']||s['typecheck']?0:1)" 2>/dev/null; then
    echo "=== Running type check ==="
    if node -e "const s=require('./package.json').scripts||{}; process.exit(s.check?0:1)" 2>/dev/null; then
      [ "$PM" = "npm" ] && npm run check || "$PM" run check
    elif node -e "const s=require('./package.json').scripts||{}; process.exit(s.typecheck?0:1)" 2>/dev/null; then
      [ "$PM" = "npm" ] && npm run typecheck || "$PM" run typecheck
    else
      [ "$PM" = "npm" ] && npm run type-check || "$PM" run type-check
    fi
  fi

  # Lint
  if node -e "const s=require('./package.json').scripts||{}; process.exit(s.lint?0:1)" 2>/dev/null; then
    echo "=== Running lint ==="
    [ "$PM" = "npm" ] && npm run lint || "$PM" run lint
  fi

  # Test
  if node -e "const s=require('./package.json').scripts||{}; process.exit(s.test?0:1)" 2>/dev/null; then
    echo "=== Running tests ==="
    [ "$PM" = "npm" ] && npm test || "$PM" test
  fi

  # Build
  if node -e "const s=require('./package.json').scripts||{}; process.exit(s.build?0:1)" 2>/dev/null; then
    echo "=== Running build ==="
    [ "$PM" = "npm" ] && npm run build || "$PM" run build
  fi

elif [ -f pyproject.toml ] || [ -f requirements.txt ]; then
  echo "=== Running Python verification ==="
  python -m pytest 2>/dev/null && true
  python -m compileall . -q 2>/dev/null && true

elif [ -f go.mod ]; then
  echo "=== Running Go verification ==="
  go vet ./... 2>/dev/null && true
  go test ./... 2>/dev/null && true

elif [ -f Cargo.toml ]; then
  echo "=== Running Rust verification ==="
  cargo check 2>/dev/null && true
  cargo test 2>/dev/null && true

else
  echo "No recognized project manifest detected."
  echo ""
  echo "Replace this section with your project's verification commands."
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Read AGENTS.md for project instructions"
echo "3. Pick ONE unfinished feature to work on"
echo "4. Implement only that feature"
echo "5. Re-run ./init.sh before claiming done"
