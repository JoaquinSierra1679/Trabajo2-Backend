
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../../public"));
//cors config
app.use(
  cors( {origin:"https://creativejoaco.com", credentials: true})
);
app.use(cookieParser());

//eerror
app.use(errorHandler);

//HBS plantillas
app.engine(".hbs",handlebars.engine({extname: '.hbs'}));
app.set('views',path.join(__dirname, "../views"));
app.set("view engine", ".hbs");


//configuracion de passport
initializePassport();
app.use(passport.initialize());

//rutas Principales
app.use("/",webRouter);
app.use("/api/designs", designsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/mockingdesigns", mockRouter);
//rutas secundarias
app.use("/chat", chatRouter);
//ruta Documentacion
const spects = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spects));


//test cors
app.get("/test", async (req, res) => {
  res.send({ payload: "respuesta" });
});

//test logger
app.get("/loggerTest", async (req,res) => {
  req.logger.debug("nivel debug");
  req.logger.http("nivel http");
  req.logger.info("nivel info");
  req.logger.warning("nivel warn");
  req.logger.error("nivel error");
  req.logger.fatal("nivel fatal");
  res.send("prueba niveles")
})


//connection mongo
const dbInstance = ConnectionDb.getInstance();