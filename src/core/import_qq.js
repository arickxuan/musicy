
export async function  getList(id,isProxy){

    let proxy = "https://cors.zme.ink/"
    let url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?newsong=1&id="+id+"&format=json&inCharset=GB2312&outCharset=utf-8"
    if (isProxy){
        url = proxy + url
    }

    let re = await fetch(url)
    let js = await re.json()

    let list =  Array.from(js.data.cdlist).flatMap(u => u.songlist).map(m => { 
        let item = { title: m.title, name:m.name, album: m.album.title ,singers: Array.from(m.singer).map(c => c.name)}
        return item
    })

    //Array.from(data.data.cdlist).flatMap(u => u.songlist).map(m => m.name + " - " + Array.from(m.singer).map(c => c.name).reduce((s1, s2) => s1 + "," + s2)).reduce((s1, s2) => s1 + '\n' + s2)
    
    return { songListName: js.data.cdlist[0].dissname, songListId: "qq_" + id, nickname: js.data.cdlist[0].nickname, logo: js.data.cdlist[0].logo, headurl: js.data.cdlist[0].headurl, songlist:list}
    

    
}

