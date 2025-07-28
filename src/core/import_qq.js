
export async function  getList(id,isProxy){

    let proxy = "https://cors.zme.ink/"
    let url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?newsong=1&id="+id+"&format=json&inCharset=GB2312&outCharset=utf-8"
    if (isProxy){
        url = proxy + url
    }

    let re = await fetch(url)
    let js = await re.json()
    console.log(js)

    return Array.from(js.data.cdlist).flatMap(u => u.songlist).map(m => m.name + " - " + Array.from(m.singer).map(c => c.name).reduce((s1, s2) => s1 + "," + s2)).reduce((s1, s2) => s1 + '\n' + s2)
    

    
}

