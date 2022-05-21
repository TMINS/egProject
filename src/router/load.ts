import { defineAsyncComponent } from 'vue'
import defaultComponent from '@/views/empty/default.vue'
import LoadingComponent from '@/views/empty/loading.vue'

export const loadComponent = (path:string) => {
    // return async () => {
        // const component = await import(/*@vite ignore*/`../views${path}`)
        // return new Promise(resolve => {
        //     console.log('*--*')
        //     component.then(() => resolve(component)).catch(() => resolve(defaultView))
        // })
    // }
    // try{
    //     const component = await import(/*@vite ignore*/`../views${path}`)
    //     component.then((res: any) => {
    //         return res
    //     })
    // }catch(err){
    //     return defaultView
    // }
    const component = defineAsyncComponent({
        loader: () => import(/*@vite ignore*/`../views${path}`),
        loadingComponent: LoadingComponent,
        errorComponent: defaultComponent,
        timeout: 3000,
    })
    return component
}