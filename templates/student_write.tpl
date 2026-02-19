<h1>Ecrire à {NAME}</h1>

<form autocomplete="off" method="post" action="index.php?p=stu&do=write&id={ID}">
    <div class="errorText">{ERROR}</div><br />
    
    <div class="infosBox">
        Indiquez ci-dessous votre email et/ou votre numéro de téléphone afin que {DEST} puisse vous répondre.
    </div>
    <br />
    Votre adresse email: <input type="text" name="emailContact" value="{emailContact}" maxlength="128" /><br />
    Votre numéro de tel.: <input type="text" name="telContact" value="{telContact}" maxlength="128" />
    
    <br /><br />
    <textarea rows="15" name="emailText" style="width: 100%;">{EMAIL}</textarea>
    
    <div style="display: {conditionsDisplay};"><br /><br /> <input type="checkbox" name="conditions" value="1" {conditionsChecked} /> En cochant la case ci-contre, vous attestez avoir pris connaissance des <a href="index.php?p=cdt">conditions d'utilisation de SOS-Maths</a> et déclarez les accepter.</div>
    
    <br /><br />
    <p>Combien font {CAPTCHA_QUESTION} ? <input type="text" name="captcha_code" size="4" maxlength="2" /></p>
    
    <br /><br />
    <input type="submit" name="submit" value="Envoyer l'email" />
</form>
