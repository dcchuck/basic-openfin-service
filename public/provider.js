
async function main () {
    function removeAppFromRegisteredApps(uuid) {
        registeredApps.forEach((el, index) => {
            if (el.uuid === uuid) {
                registeredApps.splice(index, 1);
            }
        })
    }

    let x = 0;
    const registeredApps = [];
    const service = await fin.desktop.Service.register('counter');
    function updateApps(x) {
        registeredApps.forEach(app => {
            service.dispatch(app, 'valueUpdated', x);
        }) 
    }
    service.onConnection((id) => {
        console.log(`New Connection From App: ${id.uuid}`);
        registeredApps.push(id);
        let appToRegister = fin.desktop.Application.wrap(id.uuid);
        appToRegister.addEventListener('closed', () => removeAppFromRegisteredApps(id.uuid));
    });
    service.register('getValue', (payload, id) => {
        console.log(`Value of x requested from ${id.uuid}`);
        return x;
    })
    service.register('increment', () => {
        ++x;
        updateApps(x);
		return x;
    });
    service.register('incrementBy', (payload) => {
        x += payload.amount;
        updateApps(x);
		return x;
    });
}

main().then(() => console.log(`Service successfully registered`));


