export const appExample = `use tuffite::{BrowserContext, Browser, ApplicationResult, CommandError};

mod shell_api {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

struct App;
#[tuffite::browser]
impl Browser for App {
    fn new(_context: BrowserContext) -> ApplicationResult<Self> { Ok(Self) }
}

#[tuffite::main(browser = App)]
fn main() -> tuffite::app::Builder<App> {
    tuffite::app::Builder::new().commands(tuffite::generate_handler![ping])
}

#[tuffite::command(shell_api::commands::Ping)]
fn ping(_app: &mut App, message: String) -> Result<String, CommandError> {
    Ok(message)
}`;
