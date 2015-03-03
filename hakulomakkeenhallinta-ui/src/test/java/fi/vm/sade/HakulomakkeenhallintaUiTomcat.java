package fi.vm.sade;

import fi.vm.sade.integrationtest.tomcat.EmbeddedTomcat;
import fi.vm.sade.integrationtest.tomcat.SharedTomcat;
import fi.vm.sade.integrationtest.util.PortChecker;
import fi.vm.sade.integrationtest.util.ProjectRootFinder;
import org.apache.catalina.LifecycleException;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;

public class HakulomakkeenhallintaUiTomcat extends EmbeddedTomcat {
    static final String MODULE_ROOT = ProjectRootFinder.findProjectRoot() + "/hakulomakkeenhallinta-ui";
    static final String CONTEXT_PATH = "/"; // see urlrewrite.xml
    static final int DEFAULT_PORT = 9092;
    static final int DEFAULT_AJP_PORT = 8525;

    public final static void main(String... args) throws ServletException, LifecycleException {
        useIntegrationTestSettingsIfNoProfileSelected();
        new HakulomakkeenhallintaUiTomcat(
                Integer.parseInt(System.getProperty("/hakulomakkeenhallinta-ui-app.port", String.valueOf(DEFAULT_PORT))),
                Integer.parseInt(System.getProperty("/hakulomakkeenhallinta-ui-app.port.ajp", String.valueOf(DEFAULT_AJP_PORT)))
        ).start().await();
    }

    public HakulomakkeenhallintaUiTomcat(int port, int ajpPort) {
        super(port, ajpPort, MODULE_ROOT, CONTEXT_PATH);
    }

    public static void startShared() {
        SharedTomcat.start(MODULE_ROOT, CONTEXT_PATH);
    }

    public static void startForIntegrationTestIfNotRunning() {
        useIntegrationTestSettingsIfNoProfileSelected();
        if (PortChecker.isFreeLocalPort(DEFAULT_PORT) && PortChecker.isFreeLocalPort(DEFAULT_AJP_PORT)) {
            new HakulomakkeenhallintaUiTomcat(DEFAULT_PORT, DEFAULT_AJP_PORT).start();
        } else {
            LoggerFactory.getLogger(HakulomakkeenhallintaUiTomcat.class).info("Not starting Tomcat: seems to be running on ports " + DEFAULT_PORT + "," + DEFAULT_AJP_PORT);
        }
    }

    private static void useIntegrationTestSettingsIfNoProfileSelected() {
        System.setProperty("application.system.cache", "false");
        if (System.getProperty("spring.profiles.active") == null) {
            System.setProperty("spring.profiles.active", "it");
        }
        System.out.println("Running embedded with profile " + System.getProperty("spring.profiles.active"));
    }
}