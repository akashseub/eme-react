export async function api(path,options={}) {
  const isForm=options.body instanceof FormData;
  const response=await fetch('/api'+path,{
    credentials:'same-origin',
    ...options,
    headers:{...(isForm?{}:{'Content-Type':'application/json'}),...options.headers}
  });
  if(!response.ok) {
    const e=await response.json().catch(()=>({}));
    throw new Error(e.error||`Request failed (${response.status})`);
  }
  return response.json();
}
export const post=(path,obj)=>api(path,{method:'POST',body:JSON.stringify(obj)});
export const patch=(path,obj)=>api(path,{method:'PATCH',body:JSON.stringify(obj)});
