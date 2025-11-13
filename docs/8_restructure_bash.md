#!/bin/bash

# Taskurai Project Restructuring Script
# Run this from the frontend/ directory

echo "🥋 Taskurai - Project Restructuring Script"
echo "=========================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the frontend/ directory"
    exit 1
fi

echo "📁 Creating new folder structure..."

# Create directories
mkdir -p src/components/auth
mkdir -p src/components/layout
mkdir -p src/components/pages
mkdir -p src/components/tasks
mkdir -p src/config
mkdir -p src/assets/icons
mkdir -p src/assets/images
mkdir -p ../docs

echo "✅ Directories created"
echo ""

echo "📦 Moving components..."

# Move auth components
[ -f "src/components/Login.vue" ] && mv src/components/Login.vue src/components/auth/ && echo "  ✓ Login.vue"
[ -f "src/components/Signup.vue" ] && mv src/components/Signup.vue src/components/auth/ && echo "  ✓ Signup.vue"
[ -f "src/components/SignupConfirmation.vue" ] && mv src/components/SignupConfirmation.vue src/components/auth/ && echo "  ✓ SignupConfirmation.vue"
[ -f "src/components/AuthCallback.vue" ] && mv src/components/AuthCallback.vue src/components/auth/ && echo "  ✓ AuthCallback.vue"
[ -f "src/components/SocialAuth.vue" ] && mv src/components/SocialAuth.vue src/components/auth/ && echo "  ✓ SocialAuth.vue"

# Move layout components
[ -f "src/components/Layout.vue" ] && mv src/components/Layout.vue src/components/layout/ && echo "  ✓ Layout.vue"
[ -f "src/components/ConnectionStatus.vue" ] && mv src/components/ConnectionStatus.vue src/components/layout/ && echo "  ✓ ConnectionStatus.vue"

# Move page components
[ -f "src/components/LandingPage.vue" ] && mv src/components/LandingPage.vue src/components/pages/ && echo "  ✓ LandingPage.vue"
[ -f "src/components/AboutMe.vue" ] && mv src/components/AboutMe.vue src/components/pages/ && echo "  ✓ AboutMe.vue"
[ -f "src/components/UserProfile.vue" ] && mv src/components/UserProfile.vue src/components/pages/ && echo "  ✓ UserProfile.vue"

# Move task components
[ -f "src/components/TaskList.vue" ] && mv src/components/TaskList.vue src/components/tasks/ && echo "  ✓ TaskList.vue"
[ -f "src/components/TaskInput.vue" ] && mv src/components/TaskInput.vue src/components/tasks/ && echo "  ✓ TaskInput.vue"
[ -f "src/components/TaskTable.vue" ] && mv src/components/TaskTable.vue src/components/tasks/ && echo "  ✓ TaskTable.vue"

echo ""
echo "🔧 Moving configuration..."

# Move supabase client
[ -f "src/supabaseClient.js" ] && mv src/supabaseClient.js src/config/supabase.js && echo "  ✓ supabaseClient.js → config/supabase.js"

echo ""
echo "🎨 Organizing assets..."

# Move icons
[ -f "src/assets/delete_icon_V3.png" ] && mv src/assets/delete_icon_V3.png src/assets/icons/ && echo "  ✓ delete_icon_V3.png"
[ -f "src/assets/home_icon_7.png" ] && mv src/assets/home_icon_7.png src/assets/icons/ && echo "  ✓ home_icon_7.png"
[ -f "src/assets/home_icon_8.png" ] && mv src/assets/home_icon_8.png src/assets/icons/ && echo "  ✓ home_icon_8.png"

echo ""
echo "📝 Updating import paths..."

# Update router
if [ -f "src/router/index.js" ]; then
    sed -i.bak "s|from '../components/LandingPage.vue'|from '../components/pages/LandingPage.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/TaskList.vue'|from '../components/tasks/TaskList.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/UserProfile.vue'|from '../components/pages/UserProfile.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/Signup.vue'|from '../components/auth/Signup.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/SignupConfirmation.vue'|from '../components/auth/SignupConfirmation.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/Login.vue'|from '../components/auth/Login.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/AuthCallback.vue'|from '../components/auth/AuthCallback.vue'|g" src/router/index.js
    sed -i.bak "s|from '../components/AboutMe.vue'|from '../components/pages/AboutMe.vue'|g" src/router/index.js
    rm src/router/index.js.bak 2>/dev/null
    echo "  ✓ router/index.js"
fi

# Update App.vue
if [ -f "src/App.vue" ]; then
    sed -i.bak "s|from './components/Layout.vue'|from './components/layout/Layout.vue'|g" src/App.vue
    rm src/App.vue.bak 2>/dev/null
    echo "  ✓ App.vue"
fi

# Update stores
if [ -f "src/store/authStore.js" ]; then
    sed -i.bak "s|from '../supabaseClient'|from '../config/supabase'|g" src/store/authStore.js
    rm src/store/authStore.js.bak 2>/dev/null
    echo "  ✓ store/authStore.js"
fi

if [ -f "src/store/task.js" ]; then
    sed -i.bak "s|from '../supabaseClient'|from '../config/supabase'|g" src/store/task.js
    rm src/store/task.js.bak 2>/dev/null
    echo "  ✓ store/task.js"
fi

# Update asset imports
if [ -f "src/components/tasks/TaskTable.vue" ]; then
    sed -i.bak "s|from '@/assets/delete_icon_V3.png'|from '@/assets/icons/delete_icon_V3.png'|g" src/components/tasks/TaskTable.vue
    rm src/components/tasks/TaskTable.vue.bak 2>/dev/null
    echo "  ✓ TaskTable.vue"
fi

if [ -f "src/components/pages/AboutMe.vue" ]; then
    sed -i.bak "s|@/assets/home_icon_7.png|@/assets/icons/home_icon_7.png|g" src/components/pages/AboutMe.vue
    rm src/components/pages/AboutMe.vue.bak 2>/dev/null
    echo "  ✓ AboutMe.vue"
fi

if [ -f "src/components/layout/Layout.vue" ]; then
    sed -i.bak "s|@/assets/home_icon_8.png|@/assets/icons/home_icon_8.png|g" src/components/layout/Layout.vue
    rm src/components/layout/Layout.vue.bak 2>/dev/null
    echo "  ✓ Layout.vue"
fi

echo ""
echo "📄 Creating configuration files..."

# Create .env.example
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
echo "  ✓ .env.example"

# Update .gitignore
cat >> .gitignore << 'EOF'

# Environment variables
.env
.env.local
.env.production
EOF
echo "  ✓ .gitignore updated"

echo ""
echo "✨ Restructuring complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Review changes: git status"
echo "  2. Create .env: cp .env.example .env"
echo "  3. Update .env with your Supabase credentials"
echo "  4. Update src/config/supabase.js to use env variables"
echo "  5. Test: npm run dev"
echo "  6. Commit: git add . && git commit -m 'Restructure project'"
echo ""
echo "🎉 Happy coding! 🥋"
