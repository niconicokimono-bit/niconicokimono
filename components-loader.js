/**
 * 组件加载器
 * 用于动态加载 components/ 文件夹下的 HTML 组件
 */

class ComponentLoader {
    constructor() {
        this.cache = new Map();
    }

    /**
     * 加载组件
     * @param {string} componentName - 组件名称（不包含 .html 扩展名）
     * @param {string} targetSelector - 目标选择器，组件将被插入到该元素中
     * @param {string} position - 插入位置：'beforebegin', 'afterbegin', 'beforeend', 'afterend'
     * @returns {Promise<void>}
     */
    async loadComponent(componentName, targetSelector, position = 'beforeend') {
        try {
            // 检查缓存
            if (this.cache.has(componentName)) {
                this.insertComponent(this.cache.get(componentName), targetSelector, position);
                console.log(`✓ 组件 ${componentName} 已从缓存加载`);
                return;
            }

            // 加载组件
            const componentPath = `components/${componentName}.html`;
            console.log(`📥 正在加载组件: ${componentPath}`);
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`找不到文件: ${componentPath}\n   请确认文件是否存在，路径是否正确`);
                } else {
                    throw new Error(`HTTP ${response.status}: 无法加载组件文件 ${componentPath}`);
                }
            }

            const html = await response.text();
            
            if (!html || html.trim().length === 0) {
                throw new Error(`组件文件 ${componentPath} 为空\n   请检查文件内容是否正确`);
            }
            
            // 缓存组件
            this.cache.set(componentName, html);
            
            // 插入组件
            this.insertComponent(html, targetSelector, position);
            console.log(`✓ 组件 ${componentName} 加载并插入成功`);
        } catch (error) {
            console.error(`❌ 加载组件 ${componentName} 失败:`);
            console.error(`   文件路径: components/${componentName}.html`);
            console.error(`   错误信息: ${error.message}`);
            console.error(`   完整错误:`, error);
            // 抛出错误以便调用者知道加载失败
            throw error;
        }
    }

    /**
     * 插入组件到 DOM
     * @param {string} html - HTML 内容
     * @param {string} targetSelector - 目标选择器
     * @param {string} position - 插入位置
     */
    insertComponent(html, targetSelector, position) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            throw new Error(`找不到目标元素: ${targetSelector}`);
        }

        // 根据位置插入
        try {
            switch (position) {
                case 'beforebegin':
                    target.insertAdjacentHTML('beforebegin', html);
                    break;
                case 'afterbegin':
                    target.insertAdjacentHTML('afterbegin', html);
                    break;
                case 'beforeend':
                    target.insertAdjacentHTML('beforeend', html);
                    break;
                case 'afterend':
                    target.insertAdjacentHTML('afterend', html);
                    break;
                default:
                    target.insertAdjacentHTML('beforeend', html);
            }
            
            // 组件插入后，触发事件重新绑定
            this.rebindEvents();
        } catch (error) {
            console.error(`插入组件到 ${targetSelector} 时出错:`, error);
            throw error;
        }
    }
    
    /**
     * 重新绑定事件（在组件加载后调用）
     */
    rebindEvents() {
        // 触发事件重新绑定事件
        window.dispatchEvent(new CustomEvent('componentInserted'));
    }

    /**
     * 批量加载组件
     * @param {Array<{name: string, target: string, position?: string}>} components
     * @returns {Promise<void>}
     */
    async loadComponents(components) {
        const promises = components.map(comp => 
            this.loadComponent(comp.name, comp.target, comp.position || 'beforeend')
        );
        await Promise.all(promises);
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
    }
}

// 创建全局实例
const componentLoader = new ComponentLoader();

// 页面加载完成后自动加载组件
async function loadAllComponents() {
    const errors = [];
    const loadedComponents = [];
    
    try {
        console.log('📦 开始加载组件...');
        
        // 加载 Navbar
        try {
            await componentLoader.loadComponent('navbar', '#app', 'afterbegin');
            loadedComponents.push('navbar');
            console.log('✓ Navbar 组件加载成功');
        } catch (error) {
            errors.push({ name: 'navbar', error: error.message });
            console.error('❌ Navbar 组件加载失败:', error.message);
            console.error('   请检查文件是否存在: components/navbar.html');
        }
        
        // 加载 Fixed Widgets
        try {
            await componentLoader.loadComponent('fixed-widgets', 'body', 'beforeend');
            loadedComponents.push('fixed-widgets');
            console.log('✓ Fixed Widgets 组件加载成功');
        } catch (error) {
            errors.push({ name: 'fixed-widgets', error: error.message });
            console.error('❌ Fixed Widgets 组件加载失败:', error.message);
            console.error('   请检查文件是否存在: components/fixed-widgets.html');
        }
        
        // 加载 Booking Form
        try {
            await componentLoader.loadComponent('booking-form', 'body', 'beforeend');
            loadedComponents.push('booking-form');
            console.log('✓ Booking Form 组件加载成功');
        } catch (error) {
            errors.push({ name: 'booking-form', error: error.message });
            console.error('❌ Booking Form 组件加载失败:', error.message);
            console.error('   请检查文件是否存在: components/booking-form.html');
        }
        
        // 等待一小段时间，确保 DOM 完全更新
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // 初始化 Top 按钮的滚动监听（如果组件已加载）
        initTopButton();
        
        // 验证组件是否真的加载到 DOM 中
        const navbarExists = document.querySelector('header') !== null;
        const fixedWidgetsExists = document.getElementById('fixed-top-button') !== null;
        const bookingFormExists = document.getElementById('booking-modal') !== null;
        
        console.log('🔍 验证组件加载状态:');
        console.log(`   Navbar: ${navbarExists ? '✓' : '✗'}`);
        console.log(`   Fixed Widgets: ${fixedWidgetsExists ? '✓' : '✗'}`);
        console.log(`   Booking Form: ${bookingFormExists ? '✓' : '✗'}`);
        
        // 触发自定义事件，通知组件加载完成
        const event = new CustomEvent('componentsLoaded', { 
            detail: { 
                errors: errors,
                loaded: loadedComponents,
                verified: {
                    navbar: navbarExists,
                    fixedWidgets: fixedWidgetsExists
                }
            } 
        });
        
        // 确保所有组件都加载完成后再触发事件
        console.log('✅ 所有组件加载流程完成，触发 componentsLoaded 事件');
        window.dispatchEvent(event);
        
        if (errors.length > 0) {
            console.warn(`⚠️ 有 ${errors.length} 个组件加载失败:`, errors.map(e => e.name));
            errors.forEach(err => {
                console.error(`   - ${err.name}: ${err.error}`);
            });
        } else {
            console.log('✅ 所有组件加载成功！');
        }
    } catch (error) {
        console.error('❌ 加载组件时发生严重错误:', error);
        // 即使组件加载失败，也触发事件，让应用继续运行
        window.dispatchEvent(new CustomEvent('componentsLoaded', { 
            detail: { 
                errors: errors,
                loaded: loadedComponents
            } 
        }));
    }
}

// 确保在 DOM 加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    // DOM 已经加载完成，直接执行
    loadAllComponents();
}

/**
 * 初始化 Top 按钮的滚动监听
 */
function initTopButton() {
    window.addEventListener('scroll', function() {
        const topButton = document.getElementById('fixed-top-button');
        if (topButton) {
            if (window.scrollY > 300) {
                topButton.classList.add('show');
            } else {
                topButton.classList.remove('show');
            }
        }
    });
}

