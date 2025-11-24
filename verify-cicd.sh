#!/bin/bash

echo "🔍 CI/CD Verification Script - Frontend"
echo "========================================"
echo ""

# Check if workflow file exists
if [ -f ".github/workflows/frontend-deploy.yml" ]; then
    echo "✅ Workflow file found: .github/workflows/frontend-deploy.yml"
else
    echo "❌ Workflow file NOT found!"
    exit 1
fi

# Check if Dockerfile exists
if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile found"
else
    echo "❌ Dockerfile NOT found!"
    exit 1
fi

# Check if nginx.conf exists (required for frontend)
if [ -f "nginx.conf" ]; then
    echo "✅ nginx.conf found"
else
    echo "❌ nginx.conf NOT found!"
    exit 1
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json NOT found!"
    exit 1
fi

# Check git remote
echo ""
echo "📦 Git Remote:"
git remote -v | head -1

# Check if on main/master branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if GitHub Actions is configured
echo ""
echo "🔗 GitHub Actions:"
echo "   Visit: https://github.com/Zriyaz/family-app-frontend/actions"
echo "   Check for workflow runs of 'Build and Deploy Frontend'"

# Check required secrets (can't verify locally, but remind user)
echo ""
echo "🔐 Required GitHub Secrets:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   Verify at: https://github.com/Zriyaz/family-app-frontend/settings/secrets/actions"

# Check AWS resources (if AWS CLI is configured)
if command -v aws &> /dev/null; then
    echo ""
    echo "☁️  AWS Resources Check:"
    
    # Check ECR repository
    if aws ecr describe-repositories --repository-names family-app-frontend --region us-east-1 &> /dev/null; then
        echo "   ✅ ECR Repository 'family-app-frontend' exists"
        
        # Get latest image
        LATEST_IMAGE=$(aws ecr describe-images \
            --repository-name family-app-frontend \
            --region us-east-1 \
            --query 'sort_by(imageDetails,&imagePushedAt)[-1].imageTags[0]' \
            --output text 2>/dev/null)
        
        if [ ! -z "$LATEST_IMAGE" ] && [ "$LATEST_IMAGE" != "None" ]; then
            echo "   📦 Latest image tag: $LATEST_IMAGE"
            
            # Get image push date
            PUSH_DATE=$(aws ecr describe-images \
                --repository-name family-app-frontend \
                --region us-east-1 \
                --query 'sort_by(imageDetails,&imagePushedAt)[-1].imagePushedAt' \
                --output text 2>/dev/null)
            if [ ! -z "$PUSH_DATE" ] && [ "$PUSH_DATE" != "None" ]; then
                echo "   📅 Last pushed: $PUSH_DATE"
            fi
        fi
    else
        echo "   ⚠️  ECR Repository 'family-app-frontend' not found or AWS credentials not configured"
    fi
    
    # Check ECS service
    if aws ecs describe-services \
        --cluster family-app-cluster1 \
        --services frontend-service \
        --region us-east-1 &> /dev/null; then
        echo "   ✅ ECS Service 'frontend-service' exists in cluster 'family-app-cluster1'"
        
        # Get service status
        SERVICE_STATUS=$(aws ecs describe-services \
            --cluster family-app-cluster1 \
            --services frontend-service \
            --region us-east-1 \
            --query 'services[0].status' \
            --output text 2>/dev/null)
        
        if [ ! -z "$SERVICE_STATUS" ] && [ "$SERVICE_STATUS" != "None" ]; then
            echo "   📊 Service status: $SERVICE_STATUS"
        fi
        
        # Get running task count
        RUNNING_COUNT=$(aws ecs describe-services \
            --cluster family-app-cluster1 \
            --services frontend-service \
            --region us-east-1 \
            --query 'services[0].runningCount' \
            --output text 2>/dev/null)
        
        if [ ! -z "$RUNNING_COUNT" ] && [ "$RUNNING_COUNT" != "None" ]; then
            echo "   🚀 Running tasks: $RUNNING_COUNT"
        fi
    else
        echo "   ⚠️  ECS Service not found or AWS credentials not configured"
    fi
else
    echo ""
    echo "⚠️  AWS CLI not installed. Install to verify AWS resources."
    echo "   Install: https://aws.amazon.com/cli/"
fi

echo ""
echo "✅ Local CI/CD configuration check complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check GitHub Actions tab for workflow runs"
echo "   2. Verify GitHub Secrets are configured"
echo "   3. Test by pushing a commit to main branch or use 'workflow_dispatch'"
echo "   4. Monitor deployment in AWS ECS console"
echo "   5. Check ECR for new Docker images after deployment"
echo ""
echo "🧪 Manual Test:"
echo "   - Make a small change and push to main branch"
echo "   - Watch GitHub Actions workflow run"
echo "   - Verify new image appears in ECR"
echo "   - Check ECS service updates with new deployment"

